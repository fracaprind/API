const Sequelize = require('sequelize');
const db = require('./db');

const OrderProducts = db.define('Vendas_Pedido_Lista', {
    ID_Lista: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    ID_Pedido: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    Status: {
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

    Qt: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    vlr_Total: {
        type: Sequelize.STRING,
        allowNull: false,
    },


});

//Criar a tabela
//User.sync();

//Verificar se há alguma diferença na tabela, realiza a alteração
//User.sync({ alter: true });

module.exports = OrderProducts;