"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
const express_1 = __importDefault(require("express"));
// Create a map to store json objects
const jsonStore = {
    page: {},
    workspace: {}
};
/**
 * Initialize the storage service.
 * @param app The express app to extend.
 */
function init(app) {
    // POST endpoint to store json object.
    app.post("/api/storage/:type", express_1.default.json(), (request, response) => {
        const type = request.params.type;
        const data = request.body;
        console.log("Storage::Storing entry with id:", data.id);
        const typeStore = jsonStore[type];
        if (typeStore) {
            typeStore[data.id] = {
                platform: data.platform,
                metaData: data.metaData,
                payload: data.payload
            };
        }
        response.sendStatus(200);
    });
    // GET endpoint to retrieve all json objects
    app.get("/api/storage/:type", express_1.default.json(), (request, response) => {
        const type = request.params.type;
        console.log("Storage::Retrieving all entries");
        const responseObject = {};
        const typeStore = jsonStore[type];
        if (typeStore) {
            const keys = Object.keys(typeStore);
            console.log("Storage::Keys", keys);
            for (const id of keys) {
                responseObject[id] = {
                    metaData: typeStore[id].metaData,
                    payload: typeStore[id].payload
                };
            }
        }
        response.json(responseObject);
    });
    // GET endpoint to retrieve json object
    app.get("/api/storage/:type/:id", express_1.default.json(), (request, response) => {
        const type = request.params.type;
        const id = request.params.id;
        console.log("Storage::Retrieving entry with id:", id);
        const typeStore = jsonStore[type];
        let data;
        if (typeStore) {
            data = typeStore[id];
        }
        if (!data) {
            return response.json({});
        }
        const responseObject = {
            metaData: data.metaData,
            payload: data.payload
        };
        response.json(responseObject);
    });
    // DELETE endpoint to remove json object
    app.delete("/api/storage/:type/:id", express_1.default.json(), (request, response) => {
        const type = request.params.type;
        const id = request.params.id;
        console.log("Storage::Deleting entry with id:", id);
        const typeStore = jsonStore[type];
        if (typeStore) {
            delete typeStore[id];
        }
        response.sendStatus(200);
    });
}
//# sourceMappingURL=storage.js.map