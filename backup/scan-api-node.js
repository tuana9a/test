
const fs = require('fs');

function main(filename, outname) {
    fs.readFile(filename, "utf-8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let result = [];
        let patterns = data.match(/app\.(get|post|delete|put)(.+\r\n)+/g);
        patterns.forEach(pattern => {
            let method = pattern.match(/app.\w+\s*/)[0].split(".")[1].toLocaleUpperCase();
            let url = pattern.match(/['"].+['"]\s*,/)[0].replace(/("|'|,)/g, "");

            let query = pattern.match(/req\.query\.\w+/g);
            if (query) {
                query = query.map(e => e.replace(/req.query./g, ""))
                    .reduce((total, each) => { total[`${each}`] = "_____"; return total }, {});
            }

            let body = pattern.match(/req\.body\.\w+/g);
            if (body) {
                body = body.map(e => e.replace(/req.body./g, ""))
                    .reduce((total, each) => { total[`${each}`] = "_____"; return total }, {});
            }

            let params = pattern.match(/req\.params\.\w+/g);
            if (params) {
                params = params.map(e => e.replace(/req.params./g, ""))
                    .reduce((total, each) => { total[`${each}`] = "_____"; return total }, {});
            }

            let api = { url: url, method: method };
            if (params) api.params = params;
            if (query) api.query = query;
            if (body) api.body = body;

            result.push(api);
        });

        console.log("count=" + patterns.length);
        console.log(result.map(each => JSON.stringify(each)));

        result.unshift({ count: result.length });
        fs.writeFile(outname, JSON.stringify(result, null, "\t"), { flag: "w" }, (err) => {
            if (err) console.error(err)
        });
    });
}
main(process.argv[2], process.argv[3]);