//import 'reflect-metadata';
require('dotenv').config();
const { Router } = require ('express');

const loginRouter = require ('./Login/login.routes');
const ordersRouter = require ('./Orders/orders.routes');
const clientsRouter = require ('./Clients/clients.routes');
const productsRouter = require ('./Products/products.routes');
const usersRouter = require ('./Users/users.routes');
const orderProductsRouter = require('./Orders/orderproducts.routes')

const routes = Router();

routes.use('/login', loginRouter);
routes.use('/orders', ordersRouter);
routes.use('/order', ordersRouter);
routes.use('/clients', clientsRouter);
routes.use('/client', clientsRouter);
routes.use('/products', productsRouter);
routes.use('/users', usersRouter);
routes.use('/user', usersRouter);
routes.use('/order/products', orderProductsRouter);

module.exports = routes;