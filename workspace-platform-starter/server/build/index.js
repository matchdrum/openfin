"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const share_1 = require("./share");
const storage_1 = require("./storage");
const version_1 = require("./version");
const app = (0, express_1.default)();
// Disable X-Powered-By header for security
app.disable("x-powered-by");
app.use((0, cors_1.default)({ origin: "*" }));
const mainPath = path_1.default.join(__dirname, "..", "..", "public");
const port = 8080;
const baseUrl = `http://localhost:${port}`;
console.log(`Main Path / = ${mainPath}`);
console.log("Root path checks both the main and common directories.");
app.use(express_1.default.static(mainPath));
(0, share_1.init)(app, baseUrl);
(0, version_1.init)(app);
(0, storage_1.init)(app);
app.listen(port, () => {
    console.log("server is listening on port", port);
});
//# sourceMappingURL=index.js.map