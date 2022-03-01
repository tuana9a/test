var fs = require("fs");
console.log("Going to get file info!");
fs.stat('input.txt', function (err, stats) {
    if (err) {
        return console.error(err);
    }
    console.log(stats);
    console.log("Got file info successfully!");
    // Check file type  
    console.log("isFile ? " + stats.isFile());
    console.log("isDirectory ? " + stats.isDirectory());
    
    stats.isfile();             //	returns true if file type of a simple file.
    stats.isdirectory();        //	returns true if file type of a directory.
    stats.isblockdevice();      //	returns true if file type of a block device.
    stats.ischaracterdevice();  //	returns true if file type of a character device.
    stats.issymboliclink();     //	returns true if file type of a symbolic link.
    stats.isfifo();             //	returns true if file type of a fifo.
    stats.issocket();           //returns true if file type of asocket.
});  