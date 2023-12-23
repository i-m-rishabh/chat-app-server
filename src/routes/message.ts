import express from 'express';
import authenticate from '../auth/authenticate';
import User from '../models/user';
import Message from '../models/message';
import Sequelize from 'sequelize';
import multer from 'multer';

import uploadFile from '../s3';

const router = express.Router();
const upload = multer();


router.post('/add-message/:groupid', authenticate, async (req: any, res: any) => {
    const text = req.body.text;
    const groupId = +req.params.groupid;
    const user: any = await User.findOne({ where: { id: req.user.id } });
    // console.log(user);
    if (user) {
        await user.createMessage({
            text: text,
            username: user.username,
            groupId: groupId,
        });
        res.status(201).json({ success: true, message: 'message added successfully', data: { name: req.user.username, message: text } });
    } else {
        res.status(400).json({ success: false, message: 'user not found' });
    }
})

router.post('/add-multimedia/:groupid', authenticate,  upload.single('file'), async (req: any, res: any) => {
    try {
        const file = req.file; 

        //upload to s3
        const fileLoaction = await uploadFile(file);
        const groupId = +req.params.groupid;
        const user: any = await User.findOne({ where: { id: req.user.id } });
        //saving url to database
        if (user) {
            await user.createMessage({
                multimediaUrl: fileLoaction,
                username: user.username,
                groupId: groupId,
                type: 'multimedia'
            });

            // console.log('got the file', file);

            res.status(200).json({ success: true, message: 'File uploaded successfully', data: {name: req.user.username, url: fileLoaction }});
        }else{
            throw new Error('user not found');
        }
        } catch (err) {
            console.error('error in file upload' , err);
            res.status(500).json({ success: false, message: 'error in file upload', error: err });
        }
    });

router.get('/get-messages/:groupId', authenticate, async (req: any, res: any) => {
    try {
        const groupId = req.params.groupId;
        const lastMessageId = req.query.messageId;
        // const messages = await Message.findAll({where:{id:{gt:lastMessageId}}});
        const messages = await Message.findAll({
            where: {
                groupId: groupId,
                id: {
                    [Sequelize.Op.gt]: lastMessageId,
                },
            },
        });

        console.log(messages);
        if (messages) {
            res.status(200).json({ success: true, data: messages });
        } else {
            throw new Error('error in getting messages');
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err });
    }
})

export default router;