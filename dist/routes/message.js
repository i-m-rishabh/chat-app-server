"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../auth/authenticate"));
const user_1 = __importDefault(require("../models/user"));
const router = express_1.default.Router();
router.post('/add-message', authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const text = req.body.text;
    const user = yield user_1.default.findOne({ where: { id: req.user.id } });
    console.log(user);
    if (user) {
        user.createMessage({
            text: text,
        });
        res.status(201).json({ success: true, message: 'message added successfully', data: { name: req.user.username, message: text } });
    }
    else {
        res.status(400).json({ success: false, message: 'user not found' });
    }
}));
exports.default = router;
