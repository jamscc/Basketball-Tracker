const Users = require('./users');
const Games = require('./games');

Users.hasMany(Games, {
    foreignKey: 'user_id',
});

Games.belongsTo(Users, {
    foreignKey: 'user_id',
});

module.exports = { Users, Games };