"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const db_1 = __importDefault(require("../database/db"));
const UserGroups = db_1.default.define('UserGroups', {
    isAdmin: {
        type: sequelize_1.default.BOOLEAN,
        // allowNull: false,
    }
});
exports.default = UserGroups;
