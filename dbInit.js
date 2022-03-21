// INITIALIZATION FILE FOR THE DATABASE. RUN THIS ONCE AND FORGET ABOUT IT.

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const CurrencyShop = require('./models/CurrencyShop.js')(sequelize, Sequelize.DataTypes);
require('./models/Users.js')(sequelize, Sequelize.DataTypes);
require('./models/UserItems.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({force}).then(async () => {
    const shop = [
        CurrencyShop.upsert({name: 'Tea', cost: 1}),
        CurrencyShop.upsert({name: 'Coffee', cost: 2}),
        CurrencyShop.upsert({name: 'Cake', cost: 5}),
        CurrencyShop.upsert({name: 'Notebook', cost: 15}),
        CurrencyShop.upsert({name: 'Pen', cost: 20}),
        CurrencyShop.upsert({name: 'Insight', cost: 25}),
    ];

    await Promise.all(shop);
    console.log('Database synced');

    sequelize.close();
}).catch(console.error);