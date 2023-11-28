"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const db_1 = __importDefault(require("../database/db"));
const Message = db_1.default.define('message', {
    text: {
        type: sequelize_1.default.STRING,
        allowNull: false,
    }
});
exports.default = Message;
