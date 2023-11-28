import express from 'express';
import authenticate from '../auth/authenticate';
import User from '../models/user';

const router = express.Router();

router.post('/add-message', authenticate, async(req:any, res:any)=>{
    const text = req.body.text;
    const user:any = await User.findOne({where:{id: req.user.id}});
    console.log(user);
    if(user){
        user.createMessage({
            text: text,
        });
        res.status(201).json({success:true, message:'message added successfully', data:{name:req.user.username, message:text}});
    }else{
        res.status(400).json({success:false, message:'user not found'});
    }
    
})

export default router;