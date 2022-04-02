const Sequelize = require('sequelize');
const db = require('./db');

const Client = db.define('Vendas_Clientes', {
    ID_Cliente: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    CNPJ_Empresa: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    CNPJ: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    Vendedor: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    Cliente: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    NomeFantasia: {
        type: Sequelize.STRING,
        allowNull: false,
    },    

    Email: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    Telefone: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    Contato1: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    CPF: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    Endereco: {
        type: Sequelize.STRING,
        allowNull: false,
    },
   
    Numero: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    Bairro: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    Cidade: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    UF: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    CEP: {
        type: Sequelize.STRING,
        allowNull: false,
    },

});

//Criar a tabela
//User.sync();

//Verificar se há alguma diferença na tabela, realiza a alteração
//User.sync({ alter: true });

module.exports = Client;