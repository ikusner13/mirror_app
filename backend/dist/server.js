"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socket_1 = __importDefault(require("./socket"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./logger"));
const port = config_1.default.get('port');
const origin = config_1.default.get('origin');
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: `http://localhost:${origin}`,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
app.use(express_1.default.static('build'));
socket_1.default.startSocket(io);
server.listen(port, () => {
    logger_1.default.info(`listening on port ${port}`);
});
exports.default = io;
