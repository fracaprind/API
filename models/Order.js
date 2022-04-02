const Sequelize = require('sequelize');
const db = require('./db');

const Order = db.define('Vendas_Pedidos', {
    ID_Pedido: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    Data: {
        type: Sequelize.DATE,
        allowNull: false,
    },

    cliente: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    Status: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    ValorTotal: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    Vendedor: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    CNPJ: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    Observações: {
        type: Sequelize.STRING,
        allowNull: false,
    },

});

//Criar a tabela
//User.sync();

//Verificar se há alguma diferença na tabela, realiza a alteração
//User.sync({ alter: true });

module.exports = Order;