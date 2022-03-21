// JUNCTION TABLE BETWEEN THE USERS & THE SHOP. JUNCTION TABLE CONNECTS TWO TABLES. WILL HAVE AN ADDITIONAL FIELD FOR THE AMOUNT OF THE ITEM THAT USER HAS.

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user_item', {
        user_id: DataTypes.STRING,
        item_id: DataTypes.INTEGER,
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            'default': 0,
        },
    }, {
        timestamps: false,
    });
};