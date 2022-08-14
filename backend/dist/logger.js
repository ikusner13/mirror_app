"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
exports.default = {
    info: (message) => {
        console.log(`${(0, dayjs_1.default)().format('YYYY-MM-DD HH:mm:ss')} - INFO - ${message}`);
    },
    error: (message) => {
        console.log(`${(0, dayjs_1.default)().format('YYYY-MM-DD HH:mm:ss')} - ERROR - ${message}`);
    },
};
