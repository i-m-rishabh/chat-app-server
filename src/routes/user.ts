import express from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authenticate from '../auth/authenticate';

const router = express.Router();


router.post('/signup', async (req, res) => {
    const userData = req.body;
    const { username, email, password, phone } = userData;

    // console.log([username, email, password, phone]);
    try {
        bcrypt.hash(password, 10, async function (err: any, hash: string) {
            try {
                await User.create({
                    username: username,
                    email: email,
                    password: hash,
                    phone: phone,
                    isActive: false,
                });
                res.status(200).json({ success: true, message: 'signed up successfully' });
            }
            catch (error: any) {
                // console.log(error);
                res.status(400).json({ success: false, message: error.errors[0].message })
            }
        });
    }
    catch (error: any) {
        // console.log(error);
        res.status(400).json({ message: 'something went wrong', error: error })
    }
});

const generateToken = async (user: any) => {
    // const {id} = user;
    const token = jwt.sign({ id: user.id }, 'my-secret-key');
    // console.log(token);
    return token;
}

router.post('/login', async (req, res) => {

    const { email, password } = req.body;
    // console.log([email, password]);
    try {
        const user: any = await User.findOne({ where: { email: email } });
        if (user) {
            bcrypt.compare(password, user.password, async (err, result) => {
                if (result) {
                    await User.update({ isActive: true }, { where: { id: user.id } });
                    res.status(201).json({ success: true, message: 'user authenticated successfully', token: await generateToken(user) })
                } else {
                    res.status(401).json({ success: false, message: 'authentication failed' });
                }
            })
        } else {
            res.status(404).json({ success: false, message: 'email does not exist' });
        }
    } catch (err) {
        // console.error(err);
        res.status(400).json({ success: false, message: err });
    }

})

//get all active users
router.get('/', authenticate, async (req, res) => {
    const activeUsers = await User.findAll({ where: { isActive: true } });
    res.status(200).json({ success: true, data: activeUsers });
});

//logout user
router.get('/logout', authenticate, async (req: any, res: any) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }else{
            await User.update({ isActive: false }, { where: { id: user.id } });
            res.status(200).json({ success: true, message: 'successfully logged out' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: 'error in active status update' })
    }
})


export default router;