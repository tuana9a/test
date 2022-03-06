const fs = require("fs");
const inputPath = "resource/input.txt";

function test1() {
    var data = "";
    // Create a readable stream
    const readStream = fs.createReadStream(inputPath); // read full data
    // Set the encoding to be utf8.
    readStream.setEncoding("UTF8");
    // Handle stream events --> data, end, and error
    readStream.on("data", function (chunk) {
        data += chunk;
        console.log(`chunk: "${chunk}"`);
    });
    readStream.on("end", function () {
        console.log("=================RESULT================");
        console.log(data);
    });
    readStream.on("error", function (err) {
        console.log(err.stack);
    });
    console.log("execution end");
}
test1();

function test2() {
    var data = "";
    const readStream = fs.createReadStream(inputPath, { start: 10 }); // skip first 10 byte
    // this start option make random access file with specific range
    readStream.on("data", function (chunk) {
        data += chunk;
    });
    readStream.on("end", function () {
        console.log("=================RESULT================");
        console.log(data);
    });
}

test2();
