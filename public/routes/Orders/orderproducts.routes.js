const express = require ('express');
require('dotenv').config();

const OrderProducts = require('../../../models/OrderProducts');

const router = express.Router();

//========================================================
// Buscar todos os produtos
//========================================================
router.get("/", async (req, res) => {

    const ID_Pedido = req.query.ID_Pedido;
    console.log(ID_Pedido);

    await OrderProducts.findAll({
        where: {
            ID_Pedido:ID_Pedido
        },
        attributes: ['ID_Lista','Codigo','Unidade','Descricao','vlr_unit','Qt','vlr_Total'],
        order: [['ID_Lista', 'DESC']],
    })
        .then((products) => {
            return res.json({
                erro: false,
                products,
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum produto encontrado!"
            });
        });
});

module.exports = router;