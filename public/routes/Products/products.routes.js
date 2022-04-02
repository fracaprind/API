const express = require ('express');
require('dotenv').config();

const Product = require('../../../models/Product');

const router = express.Router();

//========================================================
// Buscar todos os produtos
//========================================================
router.get("/:page", async (req, res) => {
    const { page = 1 } = req.params;
    const limit = 50;
    var lastPage = 1;
    const cnpj = req.query.cnpj;

    const countProduct = await Product.count();
    if (countProduct === null) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhum pedido encontrados!"
        });
    } else {
        lastPage = Math.ceil(countProduct / limit);
    }
    var dados = req.body;

    await Product.findAll({
        where: {
            CNPJ_Empresa:cnpj
        },
        attributes: ['ID_Produto', 'CNPJ_Empresa','Codigo','Unidade','Descricao','vlr_unit','Estoque'],
        order: [['ID_Produto', 'DESC']],
        offset: Number((page * limit) - limit),
        limit: limit
    })
        .then((products) => {
            return res.json({
                erro: false,
                products,
                countProduct,
                lastPage
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum produto encontrado!"
            });
        });
});

//=======================================================
// Busca produto por id
//=======================================================
router.get("/ID/:ID", async (req, res) => {
    const { ID } = req.params;

    await Product.findByPk(ID)
        .then((product) => {
            return res.json({
                erro: false,
                product: product,
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum produto encontrado!"
            });
        });
});

module.exports = router;

