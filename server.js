
const routes = require('./public/routes');
const express = require ('express');
const cors = require ('cors');
const path = require('path');
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

app.listen(3333, () => {
    console.log('🚀 Back-end started! '+3333);
});