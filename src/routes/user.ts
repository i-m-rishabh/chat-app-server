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
        try{
            await User.create({
                username: username,
                email: email,
                password: hash,
                phone: phone,
            });
            res.status(200).json({success:true, message:'signed up successfully'});
        }
        catch(error:any){
            // console.log(error);
            res.status(400).json({success: false, message: error.errors[0].message})
        }
    });
   }
    catch(error: any){
        // console.log(error);
        res.status(400).json({message: 'something went wrong', error: error})
   }
});

export default router;