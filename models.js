const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
    dialectOptions: {
        ssl: true
    },
});

class User extends Sequelize.Model {}
User.init(
    {
        email: Sequelize.STRING,
        password: Sequelize.STRING
    }, 
    { 
        sequelize, 
        modelName: 'user',
    }
);

class Listing extends Sequelize.Model {}
Listing.init(
    {
        title: Sequelize.STRING,
        description: Sequelize.TEXT,
        url: Sequelize.STRING,
        notes: Sequelize.TEXT,
    }, 
    { 
        sequelize, 
        modelName: 'listing',
    }
);
    
User.hasMany(Listing)
Listing.belongsTo(User)

exports.sequelize = sequelize
exports.User = User
exports.Listing = Listing