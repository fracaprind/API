const express = require ('express');
require('dotenv').config();
const yup = require('yup');
const Client = require('../../../models/Client');

const router = express.Router();

console.log('Loging in...');

//========================================================
// Buscar todos os clientes
//========================================================
router.get("/:page", async (req, res) => {
    const { page = 1 } = req.params;
    const limit = 50;
    var lastPage = 1;

    const cnpj_empresa = req.query.cnpj;
    const vendedor = req.query.vendedor;    

    const countClient = await Client.count();
    if (countClient === null) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhum cliente encontrado!"
        });
    } else {
        lastPage = Math.ceil(countClient / limit);
    }

    await Client.findAll({
            where: {
                Vendedor: vendedor,
                CNPJ_Empresa:cnpj_empresa
            },
        attributes: ['ID_Cliente', 'CNPJ_Empresa','Vendedor','Cliente','Email','Telefone'],
        order: [['ID_Cliente', 'DESC']],
        offset: Number((page * limit) - limit),
        limit: limit
    })
        .then((clients) => {
            return res.json({
                erro: false,
                clients,
                countClient,
                lastPage
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum cliente encontrado!"
            });
        });
});

//=======================================================
// Busca cliente por id
//=======================================================
router.get("/ID/:ID", async (req, res) => {
    const { ID } = req.params;

    await Client.findByPk(ID)
        .then((clients) => {
            return res.json({
                erro: false,
                client: clients,
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum cliente com esse id encontrado!"
            });
        });
});

//=======================================================
// Cadastrar Cliente
//=======================================================

router.post("/add", async (req, res) => {
    var dados = req.body;

    console.log(req.body);

    const schema = yup.object().shape({
        CNPJ_Empresa: yup.string("Erro: Necessário preencher o campo cnpj da empresa!")
            .required("Erro: Necessário preencher o campo nome o cnpj da empresa!"),         
        CNPJ: yup.string("Erro: Necessário preencher o campo cnpj!")
            .required("Erro: Necessário preencher o campo CNPJ!")         
            .min(14, "Erro: O cnpj deve ter no mínimo 14 caracteres!"),
        Cliente: yup.string("Erro: Necessário preencher o campo nome!")
            .required("Erro: Necessário preencher o campo nome do cliente!"),
        Vendedor: yup.string("Erro: Necessário preencher o campo vendedor!")
            .required("Erro: Necessário preencher o campo vendedor do cliente!"),            
        Email: yup.string("Erro: Necessário preencher o campo email!")
            .required("Erro: Necessário preencher o campo email do cliente!"), 
        Telefone: yup.string("Erro: Necessário preencher o campo telefone!")
            .required("Erro: Necessário preencher o campo telefone do cliente!"),                      

    });

    try {
        await schema.validate(dados);
    } catch (err) {
        return res.status(400).json({
            erro: true,
            mensagem: err.errors
        });
    }

    const client = await Client.findOne({
        where: {
            CNPJ: req.body.CNPJ,
            CNPJ_Empresa: req.body.CNPJ_Empresa,
            Vendedor:req.body.Vendedor
        }
    });

    if (client) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Este cnpj já está cadastrado!"
        });
    }

    console.log(dados);

    await Client.create(dados)
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Cliente cadastrado com sucesso!"
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Não foi possivel cadastrar esse cliente!"
            });
        });
});

//=======================================================
// Alterar cadastro do liente
//=======================================================

router.post("/edit", async (req, res) => {
    var dados = req.body;
    const ID_Cliente = req.body.ID_Cliente;
    console.log(req.body);

    const schema = yup.object().shape({
        CNPJ_Empresa: yup.string("Erro: Necessário preencher o campo cnpj da empresa!")
            .required("Erro: Necessário preencher o campo nome o cnpj da empresa!"),         
        CNPJ: yup.string("Erro: Necessário preencher o campo cnpj!")
            .required("Erro: Necessário preencher o campo CNPJ!")         
            .min(14, "Erro: O cnpj deve ter no mínimo 14 caracteres!"),
        Cliente: yup.string("Erro: Necessário preencher o campo nome!")
            .required("Erro: Necessário preencher o campo nome do cliente!"),
        Vendedor: yup.string("Erro: Necessário preencher o campo vendedor!")
            .required("Erro: Necessário preencher o campo vendedor do cliente!"),            
        Email: yup.string("Erro: Necessário preencher o campo email!")
            .required("Erro: Necessário preencher o campo email do cliente!"), 
        Telefone: yup.string("Erro: Necessário preencher o campo telefone!")
            .required("Erro: Necessário preencher o campo telefone do cliente!"),                      

    });

    try {
        await schema.validate(dados);
    } catch (err) {
        return res.status(400).json({
            erro: true,
            mensagem: err.errors
        });
    }

     await Client.update(req.body, { where: { ID_Cliente } })
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Cliente alterado com sucesso!"
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Não foi possivel alterar o cadastro desse cliente!"
            });
        });
});

//==============================================================================
// Excluir cadastro do cliente
//==============================================================================
router.delete("/remove/:id", async (req, res) => {
    const { ID_Cliente } = req.params;

    await Client.destroy({ where: { ID_Cliente } })
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Cliente excluido com sucesso!"
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Não foi possivel excluir o cadastro do cliente."
            });
        });
});

module.exports = router;

