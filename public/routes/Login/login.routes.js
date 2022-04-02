const express = require ('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../../../models/User');

const router = express.Router();

router.post('/', async (req, res) => {

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
    
    console.log(req.body.password)
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
 

    return res.json({
        erro: false,
        mensagem: "Login realizado com sucesso!",
        user: { Nome:user.Nome , CNPJ:user.CNPJ },
        token,
        
    });
});

module.exports = router;