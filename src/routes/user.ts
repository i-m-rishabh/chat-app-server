import express from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';

const router = express.Router();


router.post('/signup', async (req, res)=>{
    const userData = req.body;
    const {username, email, password, phone} = userData;

    // console.log([username, email, password, phone]);
   try{
    bcrypt.hash(password, 10, async function(err:any, hash:string) {
        await User.create({
            username: username,
            email: email,
            password: hash,
            phone: phone,
        });
        res.status(200).json('signed up successfully');
    });
   }
    catch(error: any){
        res.status(400).json({message: 'something went wrong', error: error.errors[0].message})
   }
});

export default router;