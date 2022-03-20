const express = require("express");

const server = express();
const testRouter = express.Router();
testRouter.get("", function (req, res) {
    res.send("1");
});
testRouter.post("", function (req, res) {
    res.send("1 post");
});

server.use(express.static("."));
server.use("/test", testRouter);
server.listen(8080);
