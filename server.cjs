const express = require("express");

const server = express();

server.use(express.static("."));

server.get("/api/html", (req, resp) => {
    resp.sendFile(__dirname + "/index.html");
});

server.listen(8080);
