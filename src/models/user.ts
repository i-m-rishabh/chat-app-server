import Sequelize from 'sequelize';
import sequelize from '../database/db';
import Message from './message';

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
export default User;