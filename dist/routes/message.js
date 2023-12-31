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
const message_1 = __importDefault(require("../models/message"));
const sequelize_1 = __importDefault(require("sequelize"));
const multer_1 = __importDefault(require("multer"));
const s3_1 = __importDefault(require("../s3"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.post('/add-message/:groupid', authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const text = req.body.text;
    const groupId = +req.params.groupid;
    const user = yield user_1.default.findOne({ where: { id: req.user.id } });
    // console.log(user);
    if (user) {
        yield user.createMessage({
            text: text,
            username: user.username,
            groupId: groupId,
        });
        res.status(201).json({ success: true, message: 'message added successfully', data: { name: req.user.username, message: text } });
    }
    else {
        res.status(400).json({ success: false, message: 'user not found' });
    }
}));
router.post('/add-multimedia/:groupid', authenticate_1.default, upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file; // File details are available here
        //upload to s3
        const fileLoaction = yield (0, s3_1.default)(file);
        const groupId = +req.params.groupid;
        const user = yield user_1.default.findOne({ where: { id: req.user.id } });
        //saving url to database
        if (user) {
            yield user.createMessage({
                multimediaUrl: fileLoaction,
                username: user.username,
                groupId: groupId,
                type: 'multimedia'
            });
            // console.log('got the file', file);
            res.status(200).json({ success: true, message: 'File uploaded successfully', data: { name: req.user.username, url: fileLoaction } });
        }
        else {
            throw new Error('user not found');
        }
    }
    catch (err) {
        console.error('error in file upload', err);
        res.status(500).json({ success: false, message: 'error in file upload', error: err });
    }
}));
router.get('/get-messages/:groupId', authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupId = req.params.groupId;
        const lastMessageId = req.query.messageId;
        // const messages = await Message.findAll({where:{id:{gt:lastMessageId}}});
        const messages = yield message_1.default.findAll({
            where: {
                groupId: groupId,
                id: {
                    [sequelize_1.default.Op.gt]: lastMessageId,
                },
            },
        });
        console.log(messages);
        if (messages) {
            res.status(200).json({ success: true, data: messages });
        }
        else {
            throw new Error('error in getting messages');
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err });
    }
}));
exports.default = router;
