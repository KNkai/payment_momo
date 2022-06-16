var express = require('express')
const app = express()
const port = process.env.PORT || "8000"
const axios = require('axios')
var QRCode = require('qrcode')

//parameters
var accessKey = 'KYJ2JRTH3kQPc0fM';
var secretKey = 'QUENNIECcIAFlMpQzY0MJZggbHF7tONH';
var partnerCode = 'MOMONDL820220615';
var redirectUrl = 'https://google.com';
var ipnUrl = 'https://payment-momo.herokuapp.com/webhook';
// var ipnUrl = 'https://webhook.site/c2766326-0711-4d58-8a28-379de96eb6da';
var orderId = partnerCode + new Date().getTime();
var requestId = orderId;
var extraData = '';
var autoCapture = true;
var requestType = 'captureWallet';
var storeId = 'ch1';
var lang = 'vi';
var payUrl = '';
var baseUrl = 'https://payment-momo.herokuapp.com/'


//signature
const crypto = require('crypto');
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
    console.log(result['payUrl']);
    return result['payUrl']
};



app.get("/:amo/:info", async(req, res) => {
    payUrl = await createOrderNew(req.params.amo, req.params.info);
    console.log("--------------------req - payUrl----------------")
    console.log(payUrl);
    let img = ''
    let qr = await QRCode.toDataURL(payUrl)
    img = `<image src= " ` + qr + `" />`
    return res.send(img)
})

app.post("/webhook", (req, res) => {
    // console.log(req.body);
    return res.send(req.body)
})

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`)
})