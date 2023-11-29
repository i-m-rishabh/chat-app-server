// interface request{
//     token: 
// }

import User from "../models/user";
import jwt from 'jsonwebtoken';

const authenticate = (req:any , res: any, next:any) => {
    const token = req.headers.authorization;
    console.log(token);
    jwt.verify(token, 'my-secret-key', async (err:any, decrptedToken:any)=>{
        if(err){
            console.log(err);
            res.status(401).json({success:false, message:'user not authenticated'});
        }else{
            const id = decrptedToken.id;
            // console.log(decrptedToken);
            const user = await User.findOne({where:{id:id}});
            // console.log(user);
            if(!user){
                res.status(401).json({success:false, message:'user does not exist'});
            }else{
                req.user = user;
                next();
            }
        }
    })
}

export default authenticate;