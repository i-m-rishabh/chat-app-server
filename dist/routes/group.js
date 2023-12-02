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
const group_1 = __importDefault(require("../models/group"));
const user_1 = __importDefault(require("../models/user"));
const authenticate_1 = __importDefault(require("../auth/authenticate"));
const router = express_1.default.Router();
router.post('/create-group', authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupName = req.body.groupName;
    // const createdBy = req.body.createdBy;
    try {
        const data = yield req.user.createGroup({
            groupName: groupName,
            createdBy: groupName === 'universal' ? 0 : req.user.id,
        });
        res.status(200).json({ success: true, data: data });
    }
    catch (err) {
        res.status(400).json({ success: false, error: 'error in group creation' });
    }
}));
router.get('/get-all-groups', authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groups = yield req.user.getGroups();
        if (groups) {
            res.status(200).json({ success: true, data: groups });
        }
        else {
            throw new Error('error in getting all groups');
        }
    }
    catch (err) {
        res.status(400).json({ success: false, error: err });
    }
}));
router.post('/update-members/:groupId', authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupId = req.params.groupId;
        const usersIds = req.body;
        const group = yield group_1.default.findByPk(groupId);
        const users = yield user_1.default.findAll({ where: { id: usersIds } });
        const response = yield group.setUsers(users);
        res.status(200).json({ success: true, data: response });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err });
    }
}));
exports.default = router;
