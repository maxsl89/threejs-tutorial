"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const app = express_1.default();
app.use(express_1.default.static(path_1.default.join(__dirname, "../client")));
app.use("/build/three.module.js", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/three/build/three.module.js")));
app.use("/jsm/controls/OrbitControls", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/three/examples/jsm/controls/OrbitControls.js")));
app.use("/jsm/loaders/GLTFLoader", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/three/examples/jsm/loaders/GLTFLoader.js")));
app.use("/jsm/libs/stats.module", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/three/examples/jsm/libs/stats.module.js")));
app.use("/jsm/libs/dat.gui.module", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/three/examples/jsm/libs/dat.gui.module.js")));
app.use("/jsm/libs/tween.module.min", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/three/examples/jsm/libs/tween.module.min.js")));
const httpServer = http_1.default.createServer(app);
const io = socket_io_1.default(httpServer);
const botName = "bot name";
// Run when client connects
io.on("connection", async (socket) => {
    console.log(`${socket.id} connected`);
    io.emit("newGame", {});
});
const port = 3000;
const server = httpServer.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
//# sourceMappingURL=server.js.map