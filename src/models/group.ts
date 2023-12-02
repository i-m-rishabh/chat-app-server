import  Sequelize  from "sequelize";
import sequelize from "../database/db";


const Group = sequelize.define('group', {
    groupName:{
        type: Sequelize.STRING,
        allowNull:false,
        unique: true,
    }, 
    createdBy: {
        type: Sequelize.INTEGER,
        allowNull:false,
    }
});

export default Group;