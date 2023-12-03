import Sequelize from 'sequelize';
import sequelize from '../database/db';
import Message from './message';
import Group from './group';
import UserGroups from './userGroups';

const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false, 
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, 
    },
    phone: {
        type: Sequelize.STRING,
    },

    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
});

Message.belongsTo(User);
User.hasMany(Message);

Message.belongsTo(Group);
Group.hasMany(Message);

Group.belongsToMany(User, {through: UserGroups});
User.belongsToMany(Group, {through: UserGroups});

export default User;