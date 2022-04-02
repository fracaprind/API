const express = require ('express');
require('dotenv').config();
const yup = require('yup');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../../../models/User');
const nodemailer = require('nodemailer');

const router = express.Router();

//========================================================
// Buscar todos os usuarios
//========================================================
router.get("/:page", async (req, res) => {
    const { page = 1 } = req.params;
    const limit = 40;
    var lastPage = 1;
    const cnpj = req.query.cnpj;

    const countUser = await User.count({
        where: {
        CNPJ:cnpj 
    }});
    if (countUser === null) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhum usuário encontrado!"
        });
    } else {
        lastPage = Math.ceil(countUser / limit);
    }

    await User.findAll({
        where: {
            CNPJ:cnpj
        },
        attributes: ['ID','CNPJ', 'Nome', 'Email'],
        order: [['ID', 'DESC']],
        offset: Number((page * limit) - limit),
        limit: limit
    })
        .then((users) => {
            return res.json({
                erro: false,
                users,
                countUser,
                lastPage
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum usuário encontrado!"
            });
        });
});

//=======================================================
// Busca usuario por id
//=======================================================
router.get("/ID/:id", async (req, res) => {
    const { id } = req.params;

    await User.findByPk(id)
        .then((user) => {
            if (user.image) {
                var endImage = process.env.URL_IMG + "/files/users/" + user.image;
            } else {
                var endImage = process.env.URL_IMG + "/files/users/icone_usuario.png";
            }
            return res.json({
                erro: false,
                user: user,
                endImage
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum usuário encontrado!"
            });
        });
});

//=======================================================
// Cadastrar usuario
//=======================================================

router.post("/add", async (req, res) => {
    var dados = req.body;

    const schema = yup.object().shape({
        password: yup.string("Erro: Necessário preencher o campo senha!")
            .required("Erro: Necessário preencher o campo senha!")
            .min(6, "Erro: A senha deve ter no mínimo 6 caracteres!"),
        Email: yup.string("Erro: Necessário preencher o campo e-mail!")
            .email("Erro: Necessário preencher o campo e-mail!")
            .required("Erro: Necessário preencher o campo e-mail!"),
        Nome: yup.string("Erro: Necessário preencher o campo nome!")
            .required("Erro: Necessário preencher o campo nome2!")
    });

    try {
        await schema.validate(dados); 
    } catch (err) {
        return res.status(400).json({
            erro: true,
            mensagem: err.errors
        });
    }

    const user = await User.findOne({
        where: {
            Email: req.body.Email
        }
    });

    if (user) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Este e-mail já está cadastrado!"
        });
    }

    dados.password = await bcrypt.hash(dados.password, 8);
    console.log(dados);
  
    await User.create(dados)
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Usuário cadastrado com sucesso!"
            });
        }).catch(() => {
            console.log(res.body);
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Não foi possivel cadastrar o usuário!"
            });
        });
});

//======================================================================
// Resgatar senha usuario
//======================================================================
router.post('/recover-password-app', async (req, res) => {

    var dados = req.body;

    const user = await User.findOne({
        attributes: ['ID', 'Nome', 'Email'],
        where: {
            email: dados.Email
        }
    });

    if (user === null) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário não encontrado!"
        });
    };


    await verifyUser(dados);

    async function verifyUser(dados) {
        dados.recover_password_app = Math.random().toString(36).slice(-6);
        console.log('Dados:' + dados.toString());
        const user = await User.findOne({
            attributes: ['ID'],
            where: {
                recover_password_app: dados.recover_password_app
            }
        });

        if (user) {
            verifyUser(dados);
        };
    };
  
    console.log('Dados:' + req.body);

    await User.update(dados, { where: { ID: user.ID } })
        .then(() => {

            var transport = nodemailer.createTransport({
                host: 'smtp.caprind.com.br',
                port: '587',
                secure:false,
                ignoreTLS: true,
                auth: {
                   // user: process.env.EMAIL_USER,
                    user: 'vendas@caprind.com.br',
                  //  pass: process.env.EMAIL_PASS
                  pass: 'Fr@2803loc$?'
                }
            });

            console.log(process.env.EMAIL_PORT);

            var message = {
                from: process.env.EMAIL_FROM_PASS,
                to: dados.Email,
                subject: "Instrução para recuperar a senha",
                text: "Prezado(a)  " + user.Nome + ".\n\nVocê solicitou alteração de senha.\n\nPara recuperar a sua senha do app, use o código de verificação abaixo:\n\n" + dados.recover_password_app + " \n\nSe você não solicitou essa alteração, nenhuma ação é necessária. Sua senha permanecerá a mesma até que você ative este código.\n\n",
                html: "Prezado(a) " + user.Nome + ".<br><br>Você solicitou alteração de senha.<br><br>Para recuperar a sua senha do app, use o código de verificação abaixo:<br><br>" + dados.recover_password_app + "<br><br>Se você não solicitou essa alteração, nenhuma ação é necessária. Sua senha permanecerá a mesma até que você ative este código.<br><br>"
            };


            transport.sendMail(message, function (err) {
                if (err) return res.status(400).json({
                    erro: true,
                    mensagem: "Erro: Aqui o Envio de E-mail com as intruções para recuperar a senha não enviado, tente novamente!"
                });

                return res.json({
                    erro: false,
                    mensagem: "Enviado e-mail com o código para recupera senha. Acesse a sua caixa de e-mail para recuperar a senha!"
                });
            });

        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Aqui --- E-mail com as intruções para recuperar a senha não enviado, tente novamente!"
            });
        });
});

//======================================================================
// Valida o codigo de verificação para alterar a senha
//======================================================================
router.get('/val-key-recover-pass-app/:key', async (req, res) => {

    const { key } = req.params;

    const user = await User.findOne({
        attributes: ['ID'],
        where: {
            recover_password_app: key
        }
    });

    if (user === null) {
        console.log("Erro: Código de verificação inválido!");
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Código de verificação inválido!"
        });
    }

    return res.json({
        erro: false,
        mensagem: "Código de verificação valido!",
        ID: user.ID
    });

});

//==========================================================================
// Altera a senha do usuario pelo app
//==========================================================================
router.put('/update-password-app', async (req, res) => {
    const { ID, password } = req.body;

    const schema = yup.object().shape({
        password: yup.string("Erro: Necessário preencher o campo senha!")
            .required("Erro: Necessário preencher o campo senha!")
            .min(6, "Erro: A senha deve ter no mínimo 6 caracteres!"),
    });

    try {
        await schema.validate(req.body);
    } catch (err) {
        return res.status(400).json({
            erro: true,
            mensagem: err.errors
        });
    }

    var senhaCrypt = await bcrypt.hash(password, 8);

    await User.update({ password: senhaCrypt, recover_password_app: null }, { where: { ID } })
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Senha editada com sucesso!"
            });

        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Senha não editada com sucesso!"
            });
        });
});
//======================================================================


module.exports = router;

