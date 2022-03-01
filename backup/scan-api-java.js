
const fs = require('fs');

function main(foldername, outname) {
    let queue = [foldername];
    let result = [];
    while (queue.length != 0) {
        let entry = queue.shift();

        let stat = fs.statSync(entry);
        if (stat.isDirectory()) {
            let files = fs.readdirSync(entry, "utf-8");
            queue.push(...(files.map(e => entry + "/" + e)));

        } else if (stat.isFile()) {
            let data = fs.readFileSync(entry, "utf-8");
            let patterns = data.match(/@WebServlet(.+)/);

            if (patterns) {
                let urls = [];
                patterns[0].match(/["'].*['"]/g).map(e => e.trim().replace(/['"\s]/g, "").split(",").forEach(e => urls.push(e)));

                if (urls.length == 1) {
                    urls = urls[0];
                }
                data.split(/(doGet|doPost|doDelete|doPut)/).forEach((each, index, arr) => {
                    if (each.match(/(doGet|doPost|doDelete|doPut)/)) {
                        let api = {};

                        api.url = urls;
                        api.method = each.trim().replace(/do/g, "").toLocaleUpperCase();
                        let pattern = arr[index + 1];

                        let query = pattern.match(/req.getParameter\(.+\)/g);
                        if (query) {
                            query = query.reduce((total, each) => {
                                let name = each.match(/".+"/)[0].replace(/"/g, "");
                                total[`${name}`] = "_____";
                                return total;
                            }, {});
                        }

                        let body = pattern.match(/requestBody.get\(.+\)/);
                        if (body) {
                            body = body.reduce((total, each) => {
                                let name = each.match(/".+"/)[0].replace(/"/g, "");
                                total[`${name}`] = "_____";
                                return total;
                            }, {});
                        }

                        if (query) api.query = query;
                        if (body) api.body = body;
                        result.push(api);
                    }
                });
            }

        } else {
            console.log(stat);
        }
    }
    console.log("count=" + result.length);
    console.log(result.map(each => JSON.stringify(each)));

    result.unshift({ count: result.length });
    fs.writeFile(outname, JSON.stringify(result, null, "\t"), { flag: "w" }, (err) => {
        if (err) console.error(err)
    });
}
main(process.argv[2], process.argv[3]);