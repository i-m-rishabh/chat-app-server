import express from 'express';
import authenticate from '../auth/authenticate';
import User from '../models/user';
import Message from '../models/message';
import Sequelize from 'sequelize';

const router = express.Router();

router.post('/add-message', authenticate, async (req: any, res: any) => {
    const text = req.body.text;
    const user: any = await User.findOne({ where: { id: req.user.id } });
    // console.log(user);
    if (user) {
        user.createMessage({
            text: text,
            username: user.username,
        });
        res.status(201).json({ success: true, message: 'message added successfully', data: { name: req.user.username, message: text } });
    } else {
        res.status(400).json({ success: false, message: 'user not found' });
    }
})

router.get('/get-messages', authenticate,  async (req: any, res: any) => {
    try {
        const lastMessageId = req.query.messageId;
        // const messages = await Message.findAll({where:{id:{gt:lastMessageId}}});
        const messages = await Message.findAll({
            where: {
              id: {
                [Sequelize.Op.gt]: lastMessageId,
              },
            },
          });
          
        // console.log(messages);
        if (messages) {
            res.status(200).json({ success: true, data: messages });
        } else {
            throw new Error('error in getting messages');
        }

        // const data = await User.findAll({
        //     attributes: ['username'],
        //     include: [
        //       {
        //         model: Message,
        //         attributes: ['text'],
        //         where: { userId: Sequelize.col('user.id') },
        //         required: true, // Use 'required: true' for INNER JOIN
        //       },
        //     ],
        //   })
          
        //   if(data){
        //     res.status(200).json({ success: true, data: data });
        //   }else{
        //     throw new Error('error in getting all messages');
        //   }
    } catch (err) {
        console.log(err);
        res.status(400).json({success:false, error: err});
    }
})

export default router;