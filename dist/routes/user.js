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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate_1 = __importDefault(require("../auth/authenticate"));
const group_1 = __importDefault(require("../models/group"));
const router = express_1.default.Router();
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const { username, email, password, phone } = userData;
    // console.log([username, email, password, phone]);
    try {
        bcrypt_1.default.hash(password, 10, function (err, hash) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = yield user_1.default.create({
                        username: username,
                        email: email,
                        password: hash,
                        phone: phone,
                        isActive: false,
                    });
                    const universalGroup = yield group_1.default.findOne({ where: { id: 1 } });
                    if (universalGroup) {
                        yield universalGroup.addUser(user);
                    }
                    res.status(200).json({ success: true, message: 'signed up successfully' });
                }
                catch (error) {
                    // console.log(error);
                    res.status(400).json({ success: false, message: error.errors[0].message });
                }
            });
        });
    }
    catch (error) {
        // console.log(error);
        res.status(400).json({ message: 'something went wrong', error: error });
    }
}));
const generateToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // const {id} = user;
    const token = jsonwebtoken_1.default.sign({ id: user.id }, 'my-secret-key');
    // console.log(token);
    return token;
});
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // console.log([email, password]);
    try {
        const user = yield user_1.default.findOne({ where: { email: email } });
        if (user) {
            bcrypt_1.default.compare(password, user.password, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (result) {
                    yield user_1.default.update({ isActive: true }, { where: { id: user.id } });
                    res.status(201).json({ success: true, message: 'user authenticated successfully', token: yield generateToken(user) });
                }
                else {
                    res.status(401).json({ success: false, message: 'authentication failed' });
                }
            }));
        }
        else {
            res.status(404).json({ success: false, message: 'email does not exist' });
        }
    }
    catch (err) {
        // console.error(err);
        res.status(400).json({ success: false, message: err });
    }
}));
//get all active users
router.get('/', authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activeUsers = yield user_1.default.findAll({ where: { isActive: true } });
    res.status(200).json({ success: true, data: activeUsers });
}));
//logout user
router.get('/logout', authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        else {
            yield user_1.default.update({ isActive: false }, { where: { id: user.id } });
            res.status(200).json({ success: true, message: 'successfully logged out' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: 'error in active status update' });
    }
}));
router.get('/get-all-users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.findAll();
        res.status(200).json({ success: true, data: users });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err });
    }
}));
router.get('/get-users/:groupid', authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.groupid;
        const group = yield group_1.default.findByPk(id);
        const users = yield group.getUsers();
        res.status(200).json({ success: true, data: users });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err });
    }
}));
exports.default = router;
