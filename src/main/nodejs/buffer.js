let buf = Buffer.alloc(256);
let len = buf.write("Simply Easy Learning");  
console.log("Octets written : "+  len);  
console.log(buf);