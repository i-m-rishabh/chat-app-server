import Sequelize from "sequelize";
import sequelize from "../database/db";

const UserGroups = sequelize.define('UserGroups', {
    isAdmin: {
        type: Sequelize.BOOLEAN,
        // allowNull: false,
    }
});

export default UserGroups;