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
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const message_1 = __importDefault(require("./routes/message"));
const group_1 = __importDefault(require("./routes/group"));
const db_1 = __importDefault(require("./database/db"));
const bodyParser = require('body-parser');
const app = (0, express_1.default)();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000"
}));
app.use('/message', message_1.default);
app.use('/', user_1.default);
app.use('/group', group_1.default);
// synchronizing the sequellize
db_1.default.sync()
    .then(() => {
    app.listen(5000, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('server started at port 5000');
        try {
            yield db_1.default.authenticate();
            console.log('connection has been established successfully.');
        }
        catch (error) {
            console.error('unable to connect to the database:', error);
        }
    }));
})
    .catch((err) => {
    console.error('error synchronizing the database', err);
});
