const Users = require('./user');
const Games = require('./game');

Users.hasMany(Games, {
    foreignKey: 'user_id',
});

Notes.belongsTo(Users, {
    foreignKey: 'user_id',
});

module.exports = { Users, Games };