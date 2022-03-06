console.log(`Process Architecture: ${process.arch}`);
console.log(`Process PID: ${process.pid}`);
console.log(`Process Platform: ${process.platform}`);
console.log(`Process Version: ${process.version}`);
console.log();
console.log(`Process Arguments: ${JSON.stringify(process.argv)}`);
console.log(`Current directory: ${process.cwd()}`);
console.log();

// EXPLAIN: kill chính process node nên các lệnh dưới không được chạy
// process.kill(pid[, signal]);
// VD:
// process.kill(process.pid);

console.log(`Uptime: ${process.uptime()}`);
console.log(`Process Memory Usage: ${JSON.stringify(process.memoryUsage())}`);

const child_process = require("child_process");
console.log(__filename.sub);
child_process.exec("dir", (err, stdout, stderr) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(stdout);
});
