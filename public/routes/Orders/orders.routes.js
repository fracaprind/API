const express = require ('express');
require('dotenv').config();

const Order = require('../../../models/Order');
const router = express.Router();

//========================================================
// Buscar todos os pedidos de vendas
//========================================================
router.get("/:page", async (req, res) => {
        const { page = 1 } = req.params;
        const limit = 50;
        var lastPage = 1;
    
        const cnpj = req.query.cnpj;
        const vendedor = req.query.vendedor;

        const countOrder = await Order.count(
            {
                where: {
                    Vendedor: vendedor,
                    CNPJ_Empresa:cnpj
                },
                attributes: ['ID_Pedido','CNPJ', 'Cliente','Status','ValorTotal','Vendedor','Data'],
                order: [['ID_Pedido', 'DESC']],
                offset: Number((page * limit) - limit),
                limit: limit
            }
        );
        if (countOrder === null) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum pedido encontrado!"
            });
        } else {
            lastPage = Math.ceil(countOrder / limit);
        }
    
        await Order.findAll({
            where: {
                Vendedor: vendedor,
                CNPJ_Empresa:cnpj
            },
            attributes: ['ID_Pedido','CNPJ','CPF','Observações','CondPagto','Contato', 'Cliente','Status','ValorTotal','Vendedor','Data'],
            order: [['ID_Pedido', 'DESC']],
            offset: Number((page * limit) - limit),
            limit: limit
        })
            .then((orders) => {
                return res.json({
                    erro: false,
                    orders,
                    countOrder,
                    lastPage
                });
            }).catch(() => {
                return res.status(400).json({
                    erro: true,
                    mensagem: "Erro: Nenhum pedido encontrado!"
                });
            });
    });

module.exports = router;
//=======================================================
// Busca pedido por id
//=======================================================
router.get("/ID/:ID", async (req, res) => {
    const { ID } = req.params;

    await Order.findByPk(ID)
        .then((order) => {
            return res.json({
                erro: false,
                order: order,
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum pedido encontrado!"
            });
        });
});
module.exports = router;
