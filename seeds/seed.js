const sequilize = require('../config/conection');
const { Users, Games } = require('../models')

const userSeedData = require('./userSeedData.json');
const gameSeedData = require('./gameSeedData.json');

const seedDataBase = async () => {
    await sequilize.sync({ force: true });

    const users = await Users.bulkCreate(userSeedData);

    for (const game of gameSeedData) {
        const newGame = await Games.create({
            ...game,

            users_id: users[Math.floor(Math.random() * users.length)].id
        });
    };
    process.exit(0);
};

seedDataBase();