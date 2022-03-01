const express = require("express");
const server = express();

server.use(express.static("pwa"));

const port = 8080;
const server = server.listen(port);
console.log("http://localhost:%s", port);
