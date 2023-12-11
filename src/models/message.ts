import  Sequelize  from "sequelize";
import sequelize from "../database/db";

const Message = sequelize.define('message', {
    text: {
        type: Sequelize.STRING,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    multimediaUrl: {
        type: Sequelize.STRING,
    },
    type: {
        type: Sequelize.ENUM('text', 'multimedia'),
        allowNull: false,
        defaultValue: 'text', // Assuming text is the default type
    },
});

export default Message;