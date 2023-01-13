const sequelize = require('../config/connection');
const { Users, Games } = require('../models')

const userSeedData = require('./userSeedData.json');
const gameSeedData = require('./gameSeedData.json');

const seedDataBase = async () => {
    await sequelize.sync({ force: true });

    const users = await Users.bulkCreate(userSeedData, {
        individualHooks: true,
    });

    for (const game of gameSeedData) {
        const newGame = await Games.create({
            ...game,

            user_id: users[Math.floor(Math.random() * users.length)].id
        });
    };
    process.exit(0);
};

seedDataBase();