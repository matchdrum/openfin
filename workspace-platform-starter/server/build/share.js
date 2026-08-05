"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
const crypto_1 = require("crypto");
const express_1 = __importDefault(require("express"));
// Create a map to store json objects
const jsonStore = new Map();
/**
 * Initialize the share service.
 * @param app The express app to extend.
 * @param baseUrl The base url of the server.
 */
function init(app, baseUrl) {
    // POST endpoint to store json object.
    app.post("/api/share", express_1.default.json(), (request, response) => {
        const id = (0, crypto_1.randomUUID)();
        const data = request.body;
        console.log("Share::Storing data with id:", id);
        jsonStore.set(id, data);
        const responseObject = {
            id,
            url: `${baseUrl}/api/share/${id}`
        };
        response.json(responseObject);
    });
    // GET endpoint to retrieve json object
    app.get("/api/share/:id", express_1.default.json(), (request, response) => {
        const id = request.params.id;
        const data = jsonStore.get(id);
        console.log("Share::Retrieving data with id:", id);
        if (!data) {
            return response.status(404).json({ error: "Data not found" });
        }
        response.json(data);
    });
}
//# sourceMappingURL=share.js.map