import  Sequelize  from "sequelize";
import sequelize from "../database/db";

const Message = sequelize.define('message', {
    text: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

export default Message;