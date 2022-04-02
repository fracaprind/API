const Sequelize = require('sequelize');
const db = require('./db');

const User = db.define('usuarios', {
    ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Nome: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Email: {
        type: Sequelize.STRING,
        allowNull: false,
    },    
    CNPJ: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    Empresa: {
        type: Sequelize.STRING,
        allowNull: true,
    },         
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Senha: {
        type: Sequelize.STRING
    },
    recover_password: {
        type: Sequelize.STRING
    },
    recover_password_app: {
        type: Sequelize.STRING
    },
    image: {
        type: Sequelize.STRING
    }
});

//Criar a tabela
//User.sync();

//Verificar se há alguma diferença na tabela, realiza a alteração
//User.sync({ alter: true });

module.exports = User;