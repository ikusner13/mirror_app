"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socket_1 = __importDefault(require("./socket"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
const { port } = require('../../config/config');
app.use(function (req, res, next) {
    const origin = req.get('origin');
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true'); //!look into
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
    // intercept OPTIONS method
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
    }
    else {
        //console.log('origin', origin);
        next();
    }
});
//app.use(express.static(path.join(__dirname, 'public')))
app.use(express_1.default.static('build'));
socket_1.default.startSocket(io);
server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
exports.default = io;
