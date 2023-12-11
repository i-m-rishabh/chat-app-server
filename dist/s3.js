"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const dotenv_1 = __importDefault(require("dotenv"));
const stream_1 = require("stream");
dotenv_1.default.config();
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const s3 = new s3_1.default({
    region,
    accessKeyId,
    secretAccessKey,
});
function uploadFile(file) {
    try {
        const fileStream = new stream_1.Readable();
        fileStream.push(file.buffer);
        fileStream.push(null);
        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: file.originalname,
            ACL: 'public-read'
        };
        return new Promise((resolve, reject) => {
            s3.upload(uploadParams, (err, data) => {
                if (err) {
                    console.log('error in uploading file:', err);
                    reject(err);
                }
                else {
                    console.log('file uploaded successfully', data.Location);
                    resolve(data.Location);
                }
            });
        });
    }
    catch (err) {
        console.log('error in fie upload', err);
    }
}
exports.default = uploadFile;
