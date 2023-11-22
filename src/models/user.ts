import Sequelize from 'sequelize';
import sequelize from '../database/db';

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

export default User;