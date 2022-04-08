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
        allowNull: true,
    },

    Cliente: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    Nome_Fantasia: {
        type: Sequelize.STRING,
        allowNull: false,
    },    

    Status: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    ValorTotal: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    Vendedor: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    CNPJ: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    CNPJ_Empresa: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    Observações: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    Contato: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    CondPagto: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    UUid: {
        type: Sequelize.STRING,
        allowNull: true,
    },

});

//Criar a tabela
//User.sync();

//Verificar se há alguma diferença na tabela, realiza a alteração
//User.sync({ alter: true });

module.exports = Order;