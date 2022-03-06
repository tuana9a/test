
const os = require('os');

console.log(__filename);

console.log("os.arch: \t", os.arch());
console.log("os.platform(): \t", os.platform());
console.log("os.type(): \t", os.type());

console.log("os.cpus: \t", (os.cpus().length));
console.log("os.freemem(): \t", os.freemem());
console.log("os.totalmem(): \t", os.totalmem());

console.log("os.homedir(): \t", os.homedir());
console.log("os.hostname(): \t", os.hostname());
console.log("os.endianness(): \t", os.endianness());

console.log("os.loadavg(): \t", os.loadavg());
console.log("os.release(): \t", os.release());
console.log("os.tmpdir(): \t", os.tmpdir());
console.log("os.uptime(): \t", os.uptime());

console.log();
const dns = require('dns');
dns.resolve4('www.google.com', (err, addresses) => {
    if (err) throw err;
    console.log(`addresses: ${JSON.stringify(addresses)}`);
    addresses.forEach((a) => {
        dns.reverse(a, (err, hostnames) => {
            if (err) {
                throw err;
            }
            console.log(`reverse for ${a}: ${JSON.stringify(hostnames)}`);
        });
    });
});
console.log();
dns.lookup('www.javatpoint.com', (err, addresses, family) => {
    console.log('addresses:', addresses);
    console.log('family:', family);
});

console.log();
dns.lookupService('127.0.0.1', 22, (err, hostname, service) => {
    console.log(hostname, service);
    // Prints: localhost  
}); 