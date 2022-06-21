// var express = require('express')
// const app = express()
// const port = process.env.PORT || "8000"
// const axios = require('axios')
// var QRCode = require('qrcode')

// var fs = require('fs');

// var WebSocketServer = require('websocket').server;
// const httpServer = require('http').createServer({}, app)


// wsServer = new WebSocketServer({
//     httpServer: httpServer,
//     autoAcceptConnections: false
// });

// function originIsAllowed(origin) {
//     return true;
// }


// CLIENTS = {};
// connectionIDCounter = 0;


// wsServer.on('request', function(request) {
//     if (!originIsAllowed(request.origin)) {
//         // Make sure we only accept requests from an allowed origin
//         request.reject();
//         console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
//         return;
//     }
//     //protocols: ['binary', 'base64']

//     console.log('-----------connection------------')
//         // console.log(request.httpRequest.headers)
//     request.id = connectionIDCounter++;
//     CLIENTS[request.id] = request;

//     var connection = request.accept('', request.origin);
//     console.log((new Date()) + ' Connection accepted.');
//     // console.log(connection);
//     connection.on('message', function(message) {
//         console.log('Received Message: ' + message.utf8Data);
//         connection.sendUTF(message.utf8Data);

//         if (isJsonString(message.utf8Data)) {
//             if (JSON.parse(message.utf8Data)['id'] == 'cl2') {
//                 wsServer.connections.forEach(e => {
//                     console.log(e.remoteAddress)
//                     e.send('send to client');
//                 });
//             }
//         }
//     });
//     connection.on('close', function(reasonCode, description) {
//         console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
//     });
// });




// function isJsonString(str) {
//     try {
//         JSON.parse(str);
//     } catch (e) {
//         return false;
//     }
//     return true;
// }


// app.use(express.static(__dirname + '/public'));
// app.use(express.json());

// //parameters
// var accessKey = 'KYJ2JRTH3kQPc0fM';
// var secretKey = 'QUENNIECcIAFlMpQzY0MJZggbHF7tONH';
// var partnerCode = 'MOMONDL820220615';
// var redirectUrl = 'https://team-knkai-payment-momo-main-7ilkntdzha-de.a.run.app/webhook';
// var ipnUrl = 'https://team-knkai-payment-momo-main-7ilkntdzha-de.a.run.app/webhook';
// // var ipnUrl = 'https://webhook.site/c2766326-0711-4d58-8a28-379de96eb6da';
// var orderId = partnerCode + new Date().getTime();
// var requestId = orderId;
// var extraData = '';
// var autoCapture = true;
// var requestType = 'captureWallet';
// var storeId = 'ch1';
// var lang = 'vi';
// var payUrl = '';
// var baseUrl = 'https://payment-momo.herokuapp.com/'
// var responseFromWebhook = 'doi thanh toan'


// //signature
// const crypto = require('crypto');
// const { json } = require('express')
// const { info } = require('console')
// var signature = '';


// createOrderNew = async(amo, info) => {
//     const _orderId = partnerCode + new Date().getTime();
//     signature = crypto.createHmac('sha256', secretKey)
//         .update("accessKey=" + accessKey + "&amount=" + amo + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + _orderId + "&orderInfo=" + info + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + _orderId + "&requestType=" + requestType)
//         .digest('hex');
//     console.log("--------------------SIGNATURE----------------")
//     console.log(signature);

//     const response = await axios({
//         method: 'post',
//         url: "https://test-payment.momo.vn/v2/gateway/api/create",
//         headers: { 'Content-Type': 'application/json', },
//         data: {
//             partnerCode: partnerCode,
//             partnerName: "ICONVINA",
//             storeId: storeId,
//             requestType: requestType,
//             ipnUrl: ipnUrl,
//             redirectUrl: redirectUrl,
//             orderId: _orderId,
//             amount: amo,
//             lang: "vi",
//             orderInfo: info,
//             requestId: _orderId,
//             extraData: extraData,
//             signature: signature
//         }
//     });
//     const result = response.data
//     console.log("--------------------RESULTs----------------")
//     console.log(result['payUrl']);
//     return result['payUrl']
// };



// app.get("/:amo/:info", async(req, res) => {
//     payUrl = await createOrderNew(req.params.amo, req.params.info);
//     console.log("--------------------req - payUrl----------------")
//     console.log(payUrl);
//     let img = ''
//     let qr = await QRCode.toDataURL(payUrl)
//     img = `<image src= " ` + qr + `" /><p>` + responseFromWebhook + `</p>`

//     return res.send(img)
// })

// app.post("/webhook", (req, res) => {
//     responseFromWebhook = req.body
//     console.log(req.body)
//     fs.appendFileSync('log.txt', (new Date()) + JSON.stringify(req.body) + "\n")
//     return res.send(req.body)
// })


// app.get('/', (req, res) => {
//     var connection = new ws.WebSocket('ws://localhost:8000');
//     connection.connection;
//     return res.send('<h1>responseFromWebhook</h1>');
// })

// app.get('/getclients', (req, res) => {

//     // return res.send('chua co client')


//     // CLIENTS.data.forEach(e => {
//     //     listClient.push(e)
//     // })
//     return res.send(CLIENTS)
// })

// httpServer.listen(port, () => {
//     console.log(`Listening to requests on http://localhost:${port}`)
// })

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
var bodyParser = require('body-parser');
var eventIO = require('./app.socket.js');
var ip = require("ip");
const cors = require('cors');
const axios = require('axios')
var QRCode = require('qrcode')
app.use(bodyParser.json())
const port = process.env.PORT || "8000"

app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

eventIO.io.attach(server);

//parameters
/*
var accessKey = 'KYJ2JRTH3kQPc0fM';
var secretKey = 'QUENNIECcIAFlMpQzY0MJZggbHF7tONH';
var partnerCode = 'MOMONDL820220615';
var redirectUrl = 'https://team-knkai-payment-momo-main-7ilkntdzha-de.a.run.app/webhook';
var ipnUrl = 'https://team-knkai-payment-momo-main-7ilkntdzha-de.a.run.app/webhook';
var orderId = partnerCode + new Date().getTime();
var requestId = orderId;
var extraData = '';
var autoCapture = true;
var requestType = 'captureWallet';
var storeId = 'ch1';
var lang = 'vi';
var payUrl = '';
*/
var accessKey = 'klm05TvNBzhg7h7j';
var secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
var partnerCode = 'MOMOBKUN20180529';
var partnerName = "ICONVINA";
var storeId = "";
var requestType = "captureWallet";
var ipnUrl = "https://payment-momo.herokuapp.com/webhook";
var redirectUrl = "https://payment-momo.herokuapp.com/";
// var amount = "";
var lang = "vi";
var autoCapture = true;
var orderInfo = "Thanh toC!n qua vC- MoMo";
var requestId = "1642387834078id";
var extraData = "";
var signature = "";

//signature
const crypto = require('crypto');
const { json } = require('express')
const { info } = require('console')
var signature = '';


createOrderNew = async(amo, info) => {
    const _orderId = partnerCode + new Date().getTime();
    signature = crypto.createHmac('sha256', secretKey)
        .update("accessKey=" + accessKey + "&amount=" + amo + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + _orderId + "&orderInfo=" + info + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + _orderId + "&requestType=" + requestType)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature);

    const response = await axios({
        method: 'post',
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: { 'Content-Type': 'application/json', },
        data: {
            partnerCode: partnerCode,
            partnerName: "ICONVINA",
            storeId: storeId,
            requestType: requestType,
            ipnUrl: ipnUrl,
            redirectUrl: redirectUrl,
            orderId: _orderId,
            amount: amo,
            lang: "vi",
            orderInfo: info,
            requestId: _orderId,
            extraData: extraData,
            signature: signature
        }
    });
    const result = response.data
    console.log("--------------------RESULTs----------------")
    console.log(result['qrCodeUrl']);
    return result['qrCodeUrl']
};



app.get("/:amo/:info", async(req, res) => {
    payUrl = await createOrderNew(req.params.amo, req.params.info);
    console.log("--------------------req - payUrl----------------")
    console.log(payUrl);
    // let img = ''
    // let qr = await QRCode.toDataURL(payUrl)
    // img = `<image src= " ` + qr + `" /><p>` + responseFromWebhook + `</p>`

    return res.send(payUrl)
})

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

app.post('/webhook', (req, res) => {
    console.log('co request post')
    var value = req.body
    const sockets = Array.from(eventIO.io.sockets.sockets).map(socket => socket[0]);

    eventIO.io.sockets.sockets.forEach(element => {
        element.emit('message', JSON.stringify(sockets))
    });
    res.send(sockets);
});

server.listen(port, () => {
    console.log(ip.address())
    console.log('listening on *' + port);
});