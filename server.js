const express = require("express");
const server = express();
server.use(express.static("./vue/3.x/dist"));
server.listen(8080);
