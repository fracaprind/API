const routes = require('./public/routes');

const express = require('express');
var cors = require('cors');
const yup = require('yup');
const nodemailer = require('nodemailer');
const { Op } = require("sequelize");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const { eAdmin } = require('./middlewares/auth');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Client = require('./models/Client');
const upload = require('./middlewares/uploadImgProfile');

const app = express();

app.use(express.json());

app.use('/files', express.static(path.resolve(__dirname, "public", "upload")));
app.use(routes);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization")
    app.use(cors());
    next();
});


//=======================================================
// Busca produto por id
//=======================================================
app.get("/product/:ID", async (req, res) => {
    const { ID } = req.params;

    await Product.findByPk(ID)
        .then((client) => {
            return res.json({
                erro: false,
                client: client,
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum produto encontrado!"
            });
        });
});

//========================================================
// Buscar todos os produtos
//========================================================
    app.get("/products/:page", async (req, res) => {
        const { page = 1 } = req.params;
        const limit = 50;
        var lastPage = 1;
    
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
                CNPJ_Empresa: dados.CNPJ_Empresa
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
// Busca cliente por id
//=======================================================
app.get("/client/:ID", async (req, res) => {
    const { ID } = req.params;

    await Client.findByPk(ID)
        .then((client) => {
            return res.json({
                erro: false,
                client: client,
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum cliente encontrado!"
            });
        });
});

//========================================================
// Buscar todos os clientes
//========================================================
    app.get("/clients/:page", async (req, res) => {
        const { page = 1 } = req.params;
        const limit = 50;
        var lastPage = 1;
    
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
                    mensagem: "Erro: Nenhum cliente encontrado2!"
                });
            });
    });

//=======================================================
// Busca pedido por id
//=======================================================
app.get("/order/:ID", async (req, res) => {
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

//========================================================
// Buscar todos os pedidos de vendas
//========================================================
    app.get("/orders/:page", async (req, res) => {
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
            attributes: ['ID_Pedido','CNPJ', 'Cliente','Status','ValorTotal','Vendedor','Data'],
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
                    mensagem: "Erro: Nenhum usuário encontrado!"
                });
            });
    });

//========================================================
// Buscar todos os usuarios
//========================================================
app.get("/users/:page", async (req, res) => {
    const { page = 1 } = req.params;
    const limit = 40;
    var lastPage = 1;

    const countUser = await User.count();
    if (countUser === null) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhum usuário encontrado!"
        });
    } else {
        lastPage = Math.ceil(countUser / limit);
    }

    await User.findAll({
        attributes: ['ID', 'Nome', 'Email'],
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
app.get("/user/:id", async (req, res) => {
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

app.post("/user", async (req, res) => {
    var dados = req.body;

    const schema = yup.object().shape({
        password: yup.string("Erro: Necessário preencher o campo senha!")
            .required("Erro: Necessário preencher o campo senha!")
            .min(6, "Erro: A senha deve ter no mínimo 6 caracteres!"),
        email: yup.string("Erro: Necessário preencher o campo e-mail!")
            .email("Erro: Necessário preencher o campo e-mail!")
            .required("Erro: Necessário preencher o campo e-mail!"),
        name: yup.string("Erro: Necessário preencher o campo nome!")
            .required("Erro: Necessário preencher o campo nome!")
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
            email: req.body.email
        }
    });

    if (user) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Este e-mail já está cadastrado!"
        });
    }

    dados.password = await bcrypt.hash(dados.password, 8);

    await User.create(dados)
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Usuário cadastrado com sucesso!"
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Usuário não cadastrado com sucesso!"
            });
        });
});


app.put("/user", eAdmin, async (req, res) => {
    const { id } = req.body;

    const schema = yup.object().shape({
        password: yup.string("Erro: Necessário preencher o campo senha!")
            .required("Erro: Necessário preencher o campo senha!")
            .min(6, "Erro: A senha deve ter no mínimo 6 caracteres!"),
        email: yup.string("Erro: Necessário preencher o campo e-mail!")
            .email("Erro: Necessário preencher o campo e-mail!")
            .required("Erro: Necessário preencher o campo e-mail!"),
        name: yup.string("Erro: Necessário preencher o campo nome!")
            .required("Erro: Necessário preencher o campo nome!")
    });

    try {
        await schema.validate(req.body);
    } catch (err) {
        return res.status(400).json({
            erro: true,
            mensagem: err.errors
        });
    }

    const user = await User.findOne({
        where: {
            email: req.body.email,
            id: {
                [Op.ne]: id
            }
        }
    });

    if (user) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Este e-mail já está cadastrado!"
        });
    }

//=======================================================
// Alterar usuario
//=======================================================

    await User.update(req.body, { where: { id } })
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Usuário editado com sucesso!"
            });

        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Usuário não editado com sucesso!"
            });
        });
});

app.put("/user-senha", eAdmin, async (req, res) => {
    const { id, password } = req.body;

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

    await User.update({ password: senhaCrypt }, { where: { id } })
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

app.delete("/user/:id", eAdmin, async (req, res) => {
    const { id } = req.params;

    await User.destroy({ where: { id } })
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Usuário apagado com sucesso!"
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Usuário não apagado com sucesso!"
            });
        });
});

app.post('/login', async (req, res) => {


    const user = await User.findOne({
        attributes: ['ID', 'Nome', 'Email', 'password', 'image','CNPJ'],
        where: {
            Email: req.body.email
        }
    });
    if (user === null) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou a senha incorreta!"
        });
    };

    if (!(await bcrypt.compare(req.body.password, user.password))) {
        console.log(req.body.password);
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou a senha incorreta!"
        });
    };

    var token = jwt.sign({ id: user.id }, process.env.SECRET, {
        //expiresIn: 60 // 10min
        expiresIn: '7d', // 7 dia
    });

    const { Nome, image } = user;

    if (image) {
        var endImage = process.env.URL_IMG + "/files/users/" + image;
    } else {
        var endImage = process.env.URL_IMG + "/files/users/icone_usuario.png";
    }

    return res.json({
        erro: false,
        mensagem: "Login realizado com sucesso!",
        user: { Nome:user.Nome , CNPJ:user.CNPJ },
        token,
        
    });
});

app.get("/val-token", eAdmin, async (req, res) => {
    await User.findByPk(req.userId, { attributes: ['id', 'name', 'email'] })
        .then((user) => {
            var token = jwt.sign({ id: user.id }, process.env.SECRET, {
                //expiresIn: 60 // 10min
                expiresIn: '7d', // 7 dia
            });

            return res.json({
                erro: false,
                user,
                token
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Necessário realizar o login para acessar a página!"
            });
        });

});

app.post("/add-user-login", async (req, res) => {
    var dados = req.body;

    const schema = yup.object().shape({
        password: yup.string("Erro: Necessário preencher o campo senha!")
            .required("Erro: Necessário preencher o campo senha!")
            .min(6, "Erro: A senha deve ter no mínimo 6 caracteres!"),
        email: yup.string("Erro: Necessário preencher o campo e-mail!")
            .email("Erro: Necessário preencher o campo e-mail!")
            .required("Erro: Necessário preencher o campo e-mail!"),
        name: yup.string("Erro: Necessário preencher o campo nome!")
            .required("Erro: Necessário preencher o campo nome!")
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
            email: req.body.email
        }
    });

    if (user) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Este e-mail já está cadastrado!"
        });
    }

    dados.password = await bcrypt.hash(dados.password, 8);

    await User.create(dados)
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Usuário cadastrado com sucesso!"
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Usuário não cadastrado com sucesso!"
            });
        });
});

app.get("/view-profile", eAdmin, async (req, res) => {
    const id = req.userId;

    await User.findByPk(id)
        .then((user) => {

            if (user.image) {
                var endImage = process.env.URL_IMG + "/files/users/" + user.image;
            } else {
                var endImage = process.env.URL_IMG + "/files/users/icone_usuario.png";
            }


            return res.json({
                erro: false,
                user,
                endImage
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum usuário encontrado!"
            });
        });
});

app.put("/edit-profile", eAdmin, async (req, res) => {
    const id = req.userId;

    const schema = yup.object().shape({
        email: yup.string("Erro: Necessário preencher o campo e-mail!")
            .email("Erro: Necessário preencher o campo e-mail!")
            .required("Erro: Necessário preencher o campo e-mail!"),
        name: yup.string("Erro: Necessário preencher o campo nome!")
            .required("Erro: Necessário preencher o campo nome!")
    });

    try {
        await schema.validate(req.body);
    } catch (err) {
        return res.status(400).json({
            erro: true,
            mensagem: err.errors
        });
    }

    const user = await User.findOne({
        where: {
            email: req.body.email,
            id: {
                [Op.ne]: id
            }
        }
    });

    if (user) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Este e-mail já está cadastrado!"
        });
    }

    await User.update(req.body, { where: { id } })
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Perfil editado com sucesso!"
            });

        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Perfil não editado com sucesso!"
            });
        });
});

app.put("/edit-profile-password", eAdmin, async (req, res) => {
    const id = req.userId;
    const { password } = req.body;

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

    await User.update({ password: senhaCrypt }, { where: { id } })
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

app.post('/recover-password', async (req, res) => {

    var dados = req.body;

    const user = await User.findOne({
        attributes: ['id', 'name', 'email'],
        where: {
            email: dados.email
        }
    });
    if (user === null) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário não encontrado!"
        });
    };

    dados.recover_password = (await bcrypt.hash(user.id + user.name + user.email, 8)).replace(/\./g, "").replace(/\//g, "");

    await User.update(dados, { where: { id: user.id } })
        .then(() => {
            var transport = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            var message = {
                from: process.env.EMAIL_FROM_PASS,
                to: dados.email,
                subject: "Instrução para recuperar a senha",
                text: "Prezado(a)  " + user.name + ".\n\nVocê solicitou alteração de senha.\n\nPara continuar o processo de recuperação de sua senha, clique no link abaixo ou cole o endereço no seu navegador: " + dados.url + dados.recover_password + " \n\nSe você não solicitou essa alteração, nenhuma ação é necessária. Sua senha permanecerá a mesma até que você ative este código.\n\n",
                html: "Prezado(a) " + user.name + ".<br><br>Você solicitou alteração de senha.<br><br>Para continuar o processo de recuperação de sua senha, clique no link abaixo ou cole o endereço no seu navegador: <a href='" + dados.url + dados.recover_password + "'>" + dados.url + dados.recover_password + "</a> <br><br>Se você não solicitou essa alteração, nenhuma ação é necessária. Sua senha permanecerá a mesma até que você ative este código.<br><br>"
            };

            transport.sendMail(message, function (err) {
                if (err) return res.status(400).json({
                    erro: true,
                    mensagem: "Erro: E-mail com as intruções para recuperar a senha não enviado, tente novamente!"
                });

                return res.json({
                    erro: false,
                    mensagem: "Enviado e-mail com instruções para recuperar a senha. Acesse a sua caixa de e-mail para recuperar a senha!"
                });
            });

        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: E-mail com as intruções para recuperar a senha não enviado, tente novamente!"
            });
        });
});

app.get('/val-key-recover-pass/:key', async (req, res) => {

    const { key } = req.params;

    const user = await User.findOne({
        attributes: ['id'],
        where: {
            recover_password: key
        }
    });
    if (user === null) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Link inválido!"
        });
    };

    return res.json({
        erro: false,
        mensagem: "Chave é valida!"
    });

});

app.put('/update-password/:key', async (req, res) => {
    const { key } = req.params;
    const { password } = req.body;

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

    await User.update({ password: senhaCrypt, recover_password: null }, { where: { recover_password: key } })
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

app.put('/edit-profile-image', eAdmin, upload.single('image'), async (req, res) => {
    if (req.file) {

        await User.findByPk(req.userId)
            .then(user => {
                const imgOld = "./public/upload/users/" + user.dataValues.image;

                fs.access(imgOld, (err) => {
                    if (!err) {
                        fs.unlink(imgOld, () => { });
                    }
                });

            }).catch(() => {
                return res.status(400).json({
                    erro: true,
                    mensagem: "Erro: Perfil não encontrado!"
                });
            });

        await User.update({ image: req.file.filename }, { where: { id: req.userId } })
            .then(() => {
                return res.json({
                    erro: false,
                    mensagem: "Imagem do perfil editado com sucesso!",
                    image: process.env.URL_IMG + "/files/users/" + req.file.filename
                });

            }).catch(() => {
                return res.status(400).json({
                    erro: true,
                    mensagem: "Erro: Imagem do perfil não editado com sucesso!"
                });
            });
    } else {
        return res.status(400).json({
            erro: false,
            mensagem: "Erro: Selecione uma imagem válida JPEG ou PNG!"
        });
    }

});

app.put('/edit-user-image/:id', eAdmin, upload.single('image'), async (req, res) => {
    if (req.file) {
        const { id } = req.params;

        await User.findByPk(id)
            .then(user => {
                const imgOld = "./public/upload/users/" + user.dataValues.image;

                fs.access(imgOld, (err) => {
                    if (!err) {
                        fs.unlink(imgOld, () => { });
                    }
                });

            }).catch(() => {
                return res.status(400).json({
                    erro: true,
                    mensagem: "Erro: Usuário não encontrado!"
                });
            });

        await User.update({ image: req.file.filename }, { where: { id } })
            .then(() => {
                return res.json({
                    erro: false,
                    mensagem: "Imagem do usuário editado com sucesso!",
                });

            }).catch(() => {
                return res.status(400).json({
                    erro: true,
                    mensagem: "Erro: Imagem do usuário não editado com sucesso!"
                });
            });
    } else {
        return res.status(400).json({
            erro: false,
            mensagem: "Erro: Selecione uma imagem válida JPEG ou PNG!"
        });
    }

});

app.post('/recover-password-app', async (req, res) => {

    var dados = req.body;

    const user = await User.findOne({
        attributes: ['id', 'name', 'email'],
        where: {
            email: dados.email
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

        const user = await User.findOne({
            attributes: ['id'],
            where: {
                recover_password_app: dados.recover_password_app
            }
        });

        if (user) {
            verifyUser(dados);
        };
    };

    await User.update(dados, { where: { id: user.id } })
        .then(() => {

            var transport = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            var message = {
                from: process.env.EMAIL_FROM_PASS,
                to: dados.email,
                subject: "Instrução para recuperar a senha",
                text: "Prezado(a)  " + user.name + ".\n\nVocê solicitou alteração de senha.\n\nPara recuperar a sua senha do app, use o código de verificação abaixo:\n\n" + dados.recover_password_app + " \n\nSe você não solicitou essa alteração, nenhuma ação é necessária. Sua senha permanecerá a mesma até que você ative este código.\n\n",
                html: "Prezado(a) " + user.name + ".<br><br>Você solicitou alteração de senha.<br><br>Para recuperar a sua senha do app, use o código de verificação abaixo:<br><br>" + dados.recover_password_app + "<br><br>Se você não solicitou essa alteração, nenhuma ação é necessária. Sua senha permanecerá a mesma até que você ative este código.<br><br>"
            };

            transport.sendMail(message, function (err) {
                if (err) return res.status(400).json({
                    erro: true,
                    mensagem: "Erro: E-mail com as intruções para recuperar a senha não enviado, tente novamente!"
                });

                return res.json({
                    erro: false,
                    mensagem: "Enviado e-mail com o código para recupera senha. Acesse a sua caixa de e-mail para recuperar a senha!"
                });
            });

        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: E-mail com as intruções para recuperar a senha não enviado, tente novamente!"
            });
        });
});

app.get('/val-key-recover-pass-app/:key', async (req, res) => {

    const { key } = req.params;

    const user = await User.findOne({
        attributes: ['id'],
        where: {
            recover_password_app: key
        }
    });
    if (user === null) {
        console.log("Acessou IF");
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Código de verificação inválido!"
        });
    }

    return res.json({
        erro: false,
        mensagem: "Código de verificação valido!",
        id: user.id
    });

});


app.put('/update-password-app', async (req, res) => {
    const { id, password } = req.body;

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

    await User.update({ password: senhaCrypt, recover_password_app: null }, { where: { id } })
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



app.listen(3333, () => {
    console.log("Servidor antigo iniciado na porta 3333: http://localhost:3333");
});