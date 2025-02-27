import type { NotificationOptions } from "@openfin/workspace/notifications";
import type { LifecycleEvents } from "workspace-platform-starter/shapes/lifecycle-shapes";
import type { Logger, LoggerCreator } from "workspace-platform-starter/shapes/logger-shapes";
import type { ModuleDefinition, ModuleHelpers } from "workspace-platform-starter/shapes/module-shapes";
import { randomUUID } from "workspace-platform-starter/utils";
import type { ExampleNotificationSourceProviderOptions } from "./shapes";

/**
 * Implementation for the example notification service event source.
 */
export class NotificationLifecycleEventSource {
	/**
	 * The module definition including settings.
	 * @internal
	 */
	private _definition: ModuleDefinition<ExampleNotificationSourceProviderOptions> | undefined;

	/**
	 * The logger for displaying information from the module.
	 * @internal
	 */
	private _logger?: Logger;

	/**
	 * Helper methods for the module.
	 * @internal
	 */
	private _helpers: ModuleHelpers | undefined;

	/**
	 * An object containing current subscriptions.
	 * @internal
	 */
	private _lifeCycleSubscriptions: { [key: string]: LifecycleEvents } | undefined;

	/**
	 * A way of raising a notification request as part of a source of notifications.
	 * @internal
	 */
	private _raiseNotificationRequest: ((notification: NotificationOptions) => Promise<void>) | undefined;

	/**
	 * Initialize the class.
	 * @param definition The definition of the module from configuration include custom options.
	 * @param loggerCreator For logging entries.
	 * @param helpers Helper methods for the module to interact with the application core.
	 * @param raiseNotificationRequest A function to passed create a notification.
	 * @returns Nothing.
	 */
	public async initialize(
		definition: ModuleDefinition<ExampleNotificationSourceProviderOptions>,
		loggerCreator: LoggerCreator,
		helpers: ModuleHelpers,
		raiseNotificationRequest: (notification: NotificationOptions) => Promise<void>
	): Promise<void> {
		this._definition = definition;
		this._logger = loggerCreator(`LifeCycleDrivenNotificationSource(${this._definition?.id}):`);
		this._helpers = helpers;
		this._raiseNotificationRequest = raiseNotificationRequest;
		this._lifeCycleSubscriptions = {};
		this._logger.info("Initializing");
		if (helpers?.subscribeLifecycleEvent) {
			const afterBootstrap = helpers.subscribeLifecycleEvent("after-bootstrap", async () => {
				await this.startNotificationLifecycleSource();
			});
			this._lifeCycleSubscriptions[afterBootstrap] = "after-bootstrap";
		}
	}

	/**
	 * Close down any resources being used by the module.
	 * @returns Nothing.
	 */
	public async closedown(): Promise<void> {
		this._logger?.info("Closedown");
		// disconnect from the lifecycle events.
		await this.stopNotificationLifecycleSource();
	}

	/**
	 * Starts the notification service.
	 */
	private async startNotificationLifecycleSource(): Promise<void> {
		if (this._helpers?.subscribeLifecycleEvent && this._raiseNotificationRequest) {
			// we have been passed the ability to subscribe to lifecycle events.
			if (!this._lifeCycleSubscriptions) {
				this._lifeCycleSubscriptions = {};
			}
			const raiseNotificationRequest = this._raiseNotificationRequest;

			if (this._definition?.data?.notifyOn?.appsChanged !== false) {
				const appsChangedSubscription = this._helpers?.subscribeLifecycleEvent("apps-changed", async () => {
					const notification: NotificationOptions = {
						id: randomUUID(),
						title: "Apps Changed Notification",
						body: `The list of apps on this platform has changed.This was generated by the example notification service (moduleId: ${this._definition?.id}).`
					};
					await raiseNotificationRequest(notification);
				});
				this._lifeCycleSubscriptions[appsChangedSubscription] = "apps-changed";
			}

			if (this._definition?.data?.notifyOn?.favoriteChanged !== false) {
				const favoriteChangedSubscription = this._helpers?.subscribeLifecycleEvent(
					"favorite-changed",
					async () => {
						const notification: NotificationOptions = {
							id: randomUUID(),
							title: "Favorite Changed Notification",
							body: `You have changed a favorite on this platform.This was generated by the example notification service (moduleId: ${this._definition?.id}).`,
							toast: "transient",
							category: "default",
							template: "markdown"
						};
						await raiseNotificationRequest(notification);
					}
				);
				this._lifeCycleSubscriptions[favoriteChangedSubscription] = "favorite-changed";
			}

			if (this._definition?.data?.notifyOn?.pageChanged !== false) {
				const pageChangedSubscription = this._helpers?.subscribeLifecycleEvent("page-changed", async () => {
					const notification: NotificationOptions = {
						id: randomUUID(),
						title: "Page Changed Notification",
						body: `You have changed the page on this platform.This was generated by the example notification service (moduleId: ${this._definition?.id}).`,
						toast: "transient",
						category: "default",
						template: "markdown"
					};
					await raiseNotificationRequest(notification);
				});
				this._lifeCycleSubscriptions[pageChangedSubscription] = "page-changed";
			}

			if (this._definition?.data?.notifyOn?.themeChanged !== false) {
				const themeChangedSubscription = this._helpers?.subscribeLifecycleEvent("theme-changed", async () => {
					const notification: NotificationOptions = {
						id: randomUUID(),
						title: "Theme Changed",
						body: `You have changed the theme for this platform. This was generated by the example notification service (moduleId: ${this._definition?.id}).`,
						form: [
							{
								type: "boolean",
								key: "intendedThemeChange",
								label: "Did you intend to change the theme?",
								widget: {
									type: "Toggle"
								}
							}
						],
						buttons: [
							{
								onClick: {
									task: "broadcast",
									customData: {
										id: "green",
										task: "broadcast",
										context: {
											type: "custom.context",
											name: "Form Submitted"
										},
										broadcastOptions: {
											isUserChannel: true
										}
									}
								},
								cta: true,
								submit: true,
								title: "Broadcast Form on Green",
								type: "button"
							}
						]
					};
					await raiseNotificationRequest(notification);
				});
				this._lifeCycleSubscriptions[themeChangedSubscription] = "theme-changed";
			}

			if (this._definition?.data?.notifyOn?.workspaceChanged !== false) {
				const workspaceChangedSubscription = this._helpers?.subscribeLifecycleEvent(
					"workspace-changed",
					async () => {
						const notification: NotificationOptions = {
							title: "Workspace Changed",
							body: `You have changed your workspace. This was generated by the example notification service (moduleId: ${this._definition?.id}).`,
							toast: "transient",
							category: "default",
							template: "markdown",
							buttons: []
						};
						await raiseNotificationRequest(notification);
					}
				);
				this._lifeCycleSubscriptions[workspaceChangedSubscription] = "workspace-changed";
			}
		}
	}

	/**
	 * Stops the notification service.
	 */
	private async stopNotificationLifecycleSource(): Promise<void> {
		this._logger?.info("Stopping notification service (Not Really...this is an example.)");
		if (this._helpers?.unsubscribeLifecycleEvent && this._lifeCycleSubscriptions) {
			for (const [key, value] of Object.entries(this._lifeCycleSubscriptions)) {
				this._helpers.unsubscribeLifecycleEvent(key, value);
			}
		}
	}
}
