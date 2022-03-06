const child_process = require("child_process");
for (let id = 1; id <= 2; id++) {
    let child = child_process.fork("src/main/nodejs/process/child.js", { detached: false });
    child.send({ id: id, content: "helo world" });
    child.on("exit", function (code) {
        console.log("child process exited with code " + code);
    });
}
setTimeout(() => {
    // exit kiểu này sẽ kill luôn các process con
    process.exit(1);
}, 1000);
