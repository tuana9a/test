process.on("message", function (msg) {
    console.log("child got message: " + JSON.stringify(msg)); 
});
