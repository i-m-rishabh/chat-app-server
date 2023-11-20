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
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const { username, email, password, phone } = userData;
    // console.log([username, email, password, phone]);
    try {
        bcrypt_1.default.hash(password, 10, function (err, hash) {
            return __awaiter(this, void 0, void 0, function* () {
                yield user_1.default.create({
                    username: username,
                    email: email,
                    password: hash,
                    phone: phone,
                });
                res.status(200).json('signed up successfully');
            });
        });
    }
    catch (error) {
        res.status(400).json({ message: 'something went wrong', error: error.errors[0].message });
    }
}));
exports.default = router;
