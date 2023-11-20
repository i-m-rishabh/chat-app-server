"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const db_1 = __importDefault(require("../database/db"));
const User = db_1.default.define('user', {
    username: {
        type: sequelize_1.default.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.default.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: sequelize_1.default.STRING,
    },
    password: {
        type: sequelize_1.default.STRING,
        allowNull: false,
    }
});
exports.default = User;
