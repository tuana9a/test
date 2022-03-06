// __dirname
// __filename
// Console
// Process
// Buffer
// setImmediate(callback[, arg][, ...])
// setInterval(callback, delay[, arg][, ...])
// setTimeout(callback, delay[, arg][, ...])
// clearImmediate(immediateObject)
// clearInterval(intervalObject)
// clearTimeout(timeoutObject)

console.log(__dirname)
console.log(__filename)
var buf = new Buffer(10);  
// Create a buffer from array: Following is the syntax to create a Buffer from a given array:
var buf = new Buffer([10, 20, 30, 40, 50]);   
// Create a buffer from string: Following is the syntax to create a Buffer from a given string and optionally encoding type:
var buf = new Buffer("Simply Easy Learning", "utf-8");   
