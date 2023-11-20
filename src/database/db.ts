import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('chat-app-db', 'root', 'rishabh', {
    host: 'localhost',
    dialect: 'mysql'
});

export default sequelize;