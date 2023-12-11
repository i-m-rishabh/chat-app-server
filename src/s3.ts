import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config()

const bucketName:any = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
});

function uploadFile(file:any){
   try{
    const fileStream = new Readable();
    fileStream.push(file.buffer);
    fileStream.push(null);

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.originalname,
        ACL: 'public-read'
    }

    return new Promise((resolve, reject) => {
        s3.upload(uploadParams, (err: any, data: any) => {
            if (err) {
                console.log('error in uploading file:', err)
                reject(err);
            } else {
                console.log('file uploaded successfully', data.Location);
                resolve(data.Location);
            }
        });
    });
   }catch(err){
    console.log('error in fie upload' , err);
   }
}

export default uploadFile;
