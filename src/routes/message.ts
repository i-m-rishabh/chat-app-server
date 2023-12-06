import express from 'express';
import authenticate from '../auth/authenticate';
import User from '../models/user';
import Message from '../models/message';
import Sequelize from 'sequelize';

const router = express.Router();

router.post('/add-message/:groupid', authenticate, async (req: any, res: any) => {
    const text = req.body.text;
    const groupId = +req.params.groupid;
    const user: any = await User.findOne({ where: { id: req.user.id } });

    const io = req.io;

    // console.log(user);
    if (user) {
        await user.createMessage({
            text: text,
            username: user.username,
            groupId: groupId,
        });

        // Emit the message to all clients in the group
        io.to(groupId.toString()).emit('chat message', {
            username:user.username,
            text: text,
        });

        res.status(201).json({ success: true, message: 'message added successfully', data: { name: req.user.username, message: text } });
    } else {
        res.status(400).json({ success: false, message: 'user not found' });
    }
})

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