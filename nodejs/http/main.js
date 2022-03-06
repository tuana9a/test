const https = require('https');
const fs = require('fs');
const port = 1406;

const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};

fs.readFile('./home1.html', function (err, html) {
    if (err) throw err;

    https.createServer(options, function (req, resp) {
        let now = new Date();
        console.log(port + " received at " + hourMinuteSecondFormat(now.getHours(), now.getMinutes(), now.getSeconds()));
        resp.writeHead(200);
        resp.write(html);
        resp.end();
    }).listen(port);
    console.log("listening on port " + port)
})

function hourMinuteSecondFormat(hour = 0, minute = 0, second = 0) {
    return ''
        + (hour < 10 ? "0" + hour : hour)
        + ':' + (minute < 10 ? "0" + minute : minute)
        + ':' + (second < 10 ? "0" + second : second)
}