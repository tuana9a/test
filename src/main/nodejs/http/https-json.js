const https = require("https");
const fs = require("fs");

const options = {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem"),
};

// Create a server
https
    .createServer(options, function (request, response) {
        const { headers, method, url } = request;
        let body = [];
        console.log(headers, method, url);
        request
            .on("error", function (err) {
                console.error(err);
            })
            .on("data", function (chunk) {
                body.push(chunk);
            })
            .on("end", function () {
                body = Buffer.concat(body).toString();
                console.log(JSON.parse(body));
                // At this point, we have the headers, method, url and body, and can now
                // do whatever we need to in order to respond to this request.
            });
        // response.write("sucess");
        response.end();
    })
    .listen(8443);

setTimeout(function () {
    process.exit(0);
}, 5000);

// Console will print the message
console.log("Server running at https://127.0.0.1:8443/");
