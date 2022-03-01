function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}

function checkBitOn(input, nth) {
    return (input & (1 << nth)) != 0
}
function setBitOn(input, nth) {
    return input | (1 << nth)
}
function setBitOff(input, nth) {
    return input & ((~0) & (~(1 << nth)))
}

console.log(dec2bin(1)); // 1
console.log(dec2bin(-1)); // 11111111111111111111111111111111
console.log(dec2bin(256)); // 100000000
console.log(dec2bin(-256)); // 11111111111111111111111100000000
console.log(dec2bin(~0));
console.log(dec2bin(0 | (1 << 2) | (1 << 1) | (1 << 10)));
console.log(dec2bin((0 | (1 << 2) | (1 << 1)) & (1 << 1)));
console.log("=========================")
console.log(dec2bin(setBitOn(0, 1)))
console.log(dec2bin(setBitOn(0, 2)))
console.log(dec2bin(setBitOff(setBitOn(0, 2), 2)))
console.log(dec2bin(setBitOn(setBitOn(0, 10), 2)))
console.log(dec2bin(setBitOff(setBitOn(setBitOn(0, 10), 2), 10)))
// console.log(checkBitOn(setBitOn(0, 10), 10))
