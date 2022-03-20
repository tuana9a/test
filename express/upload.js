const express = require("express");
const multer = require("multer");

const server = express();
server.post("/upload/nomulter", async function (req, res) {
  console.log("=============================");
  console.log(req.file);
  const body = [];
  req.on("data", function (data) {
    body.push(data);
  });
  req.on("end", function () {
    console.log(String(body));
    res.sendStatus(200);
  });
});

server.post("/upload/multer", multer().single("file"), async function (req, res) {
  console.log("=============================");
  console.log(req.file);
  console.log(req.headers);
  const body = [];
  req.on("data", function (data) {
    body.push(data);
  });
  req.on("end", function () {
    console.log(String(body));
  });
  res.sendStatus(200);
});

server.listen(80);
