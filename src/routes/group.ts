import sequelize from "../database/db";
import express from 'express';
import Group from "../models/group";
import User from "../models/user";
import authenticate from "../auth/authenticate";

const router = express.Router();

router.post('/create-group', authenticate, async (req: any, res: any) => {
    const groupName = req.body.groupName;
    // const createdBy = req.body.createdBy;

    try {
        const data = await req.user.createGroup({
            groupName: groupName,
            createdBy: groupName === 'universal' ? 0 : req.user.id,
        });

        res.status(200).json({ success: true, data: data });
    } catch (err) {
        res.status(400).json({ success: false, error: 'error in group creation' });
    }
})

router.get('/get-all-groups', authenticate, async (req: any, res: any) => {
    try {
        const groups = await req.user.getGroups();
        if (groups) {
            res.status(200).json({ success: true, data: groups });
        } else {
            throw new Error('error in getting all groups');
        }
    } catch (err) {
        res.status(400).json({ success: false, error: err });
    }
});

router.post('/update-members/:groupId', authenticate, async (req: any, res: any) => {
    try {
        const groupId = req.params.groupId;
        const usersIds = req.body;
        const group:any = await Group.findByPk(groupId);
        const users = await User.findAll({where: {id: usersIds}});

        const response = await group.setUsers(users);
        res.status(200).json({success:true, data:response});
    } catch (err) {
        res.status(400).json({ success: false, error: err });
    }
})

export default router;