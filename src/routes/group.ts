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
        const group = await req.user.createGroup({
            groupName: groupName,
            // createdBy: groupName === 'universal' ? 0 : req.user.id,
            createdBy: req.user.id,
        });
        //adding this user to this group
        await req.user.addGroup(group, { through: { isAdmin: true } })
        res.status(200).json({ success: true, data: group });
    } catch (err) {
        console.error(err);
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
        const group: any = await Group.findByPk(groupId);
        const users = await User.findAll({ where: { id: usersIds } });

        const response = await group.setUsers(users, { through: { isAdmin: false } });
        //setting mainUser as admin 
        await group.addUser(req.user, { through: { isAdmin: true } });

        res.status(200).json({ success: true, data: response });
    } catch (err) {
        res.status(400).json({ success: false, error: err });
    }
});

router.get('/get-admins/:groupId', authenticate, async (req: any, res: any) => {
    try {
        const groupId =  req.params.groupId;
        const group:any = await Group.findByPk(groupId);
        const allUsers = await group.getUsers();
        const admins = allUsers.filter((user:any)=>{
            return user.UserGroups.isAdmin === true;
        })
        res.status(200).json({success:true, data:admins});
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: err });
    }
    
});

router.post('/update-admins/:groupId', authenticate, async (req:any, res:any)=>{
    try{
        const groupId = req.params.groupId;
        const adminIds = req.body;
        console.log(['admin ids', adminIds]);
        const adminUsers = await User.findAll({where:{id:adminIds}});
        const group:any = await Group.findByPk(groupId);
        const allGroupUsers = await group.getUsers();
        await group.setUsers(allGroupUsers, {through:{isAdmin:false}});
        const data = await group.addUsers(adminUsers, {through:{isAdmin:true}});
        res.status(200).json({success:true, data:data});
    }catch(error){
        console.error(error);
        res.status(400).json({success:false, error:error});
    }
})

export default router;