"use strict";
// interface request{
//     token: 
// }
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
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    jsonwebtoken_1.default.verify(token, 'my-secret-key', (err, decrptedToken) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            res.status(401).json({ success: false, message: 'user not authenticated' });
        }
        else {
            const id = decrptedToken.id;
            // console.log(decrptedToken);
            const user = yield user_1.default.findOne({ where: { id: id } });
            // console.log(user);
            if (!user) {
                res.status(401).json({ success: false, message: 'user does not exist' });
            }
            else {
                req.user = user;
                next();
            }
        }
    }));
};
exports.default = authenticate;
