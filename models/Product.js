const Sequelize = require('sequelize');
const db = require('./db');

const Client = db.define('Vendas_Produtos', {
    ID_Produto: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    CNPJ_Empresa: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    Codigo: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    Unidade: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    Descricao: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    vlr_unit: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    Estoque: {
        type: Sequelize.STRING,
        allowNull: false,
    },    

});

//Criar a tabela
//User.sync();

//Verificar se há alguma diferença na tabela, realiza a alteração
//User.sync({ alter: true });

module.exports = Client;