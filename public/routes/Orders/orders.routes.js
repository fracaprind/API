const express = require ('express');
require('dotenv').config();
const yup = require('yup');
const Order = require('../../../models/Order');
const router = express.Router();

//=======================================================
// Cadastrar Cliente
//=======================================================

router.post("/add", async (req, res) => {
    var dados = req.body;

 //   console.log(req.body);

    const schema = yup.object().shape({
     //   CNPJ_Empresa: yup.string("Erro: Necessário preencher o campo cnpj da empresa!")
     //       .required("Erro: Necessário preencher o campo nome o cnpj da empresa!"),         
        CNPJ: yup.string("Erro: Necessário preencher o campo cnpj!")
            .required("Erro: Necessário preencher o campo CNPJ!")         
            .min(14, "Erro: O cnpj deve ter no mínimo 14 caracteres!"),
    //    Cliente: yup.string("Erro: Necessário preencher o campo nome!")
     //       .required("Erro: Necessário preencher o campo nome do cliente!"),
     //   Vendedor: yup.string("Erro: Necessário preencher o campo vendedor!")
     //       .required("Erro: Necessário preencher o campo vendedor do cliente!"),                                
    });

    try {
        await schema.validate(dados);
    } catch (err) {
        return res.status(400).json({
            erro: true,
            mensagem: err.errors
        });
    }
    console.log(dados);

    await Order.create(dados)
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Pedido de venda cadastrado com sucesso!"
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Não foi possivel cadastrar esse pedido de venda!"
            });
        });
});


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
