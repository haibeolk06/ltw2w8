const { Sequelize } = require('sequelize');

module.exports = new Sequelize(process.env.DATABASE_URL || 'postgres://dbxlefibtzckuz:a219f404daa9d61c090b2fa62c1adb10c9a0313c11e651b6048eea009735b3bb@ec2-54-167-152-185.compute-1.amazonaws.com:5432/d8690elb7itlir', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});