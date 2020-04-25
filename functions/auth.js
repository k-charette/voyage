const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')

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

exports.handler = async (event) => {
    try {
        await sequelize.authenticate()
        // await sequelize.sync({force: true})
        // const salt = bcrypt.genSaltSync(10)
        // const hash = bcrypt.hashSync('password', salt)
        // const user = await User.create({
        //     email: 'test@example.com',
        //     password: hash
        // })

        // const count = await User.count()
        const { name, pass } = basicAuth(event)
        const user = await User.findOne({
            where: {
                email: {
                    [Sequelize.Op.iLike]: name
                    }
                }
            })
                    
            if (user) {
                const passwordsMatch = await bcrypt.compare(pass, user.password)
                    if (passwordsMatch) {
                        const token = jwt.sign({
                            id: user.id,
                            email: user.email
                        }, process.env.JWT_SECRET)
                        return {
                            statusCode: 200,
                            body: token
                        }
                    }
                }
                                    
    return {
            statusCode: 401,
            body: 'Incorrect email/password combo',
        }
    } catch(err) {
        return {
            statusCode: 404,
            body: `There was an error: ${err.message}`
        }
    };
}

