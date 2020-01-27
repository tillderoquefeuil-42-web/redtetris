const express = require('express');
const bodyParser = require('body-parser');

const params = require('../../params');

const app = express();
let router = express.Router();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// CORS
app.use(function (req, res, next) {
    let allowedOrigins = [`http://localhost:${params.client.port}`, `http://127.0.0.1:${params.client.port}`, params.client.url];

    let origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

let server = app.listen(params.server.port, params.server.host, () => {
    console.log(`Example app listening at ${params.server.url}`);
});

// SOCKET.IO MANAGEMENT
require(__dirname + '/controllers/socketController')(router, server);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

