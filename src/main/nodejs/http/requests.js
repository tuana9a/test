/**
 *
 * main() will be run when you invoke this action
 *
 * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
 *
 * @return The output of this action, which must be a JSON object.
 *
 */
const http = require("http");
const host = "123.24.106.41"; //sau này có thể phải thay host lại
const port = 8080;

const queryStudent = "/service/search/student?studentId=";
const queryNews = "/service/search/news?typeSearch=name&keyWords=";

async function getStudent(mssv) {
    var returnValue = new Promise((resolve, reject) => {
        http.get(
            {
                hostname: host,
                port: port,
                path: queryStudent + mssv,
                agent: false,
            },
            (response) => {
                var str = "";
                //another chunk of data has been received, so append it to `str`
                response.on("data", function (chunk) {
                    str += chunk;
                });
                //the whole response has been received, so we just print it out here
                response.on("end", function () {
                    resolve(str);
                });
            }
        );
    });
    return await returnValue;
}

async function getNews() {
    var returnValue = new Promise((resolve, reject) => {
        http.get(
            {
                hostname: host,
                port: port,
                path: queryNews,
                agent: false,
            },
            (response) => {
                var str = "";
                //another chunk of data has been received, so append it to `str`
                response.on("data", function (chunk) {
                    str += chunk;
                });
                //the whole response has been received, so we just print it out here
                response.on("end", function () {
                    resolve(str);
                });
            }
        );
    });
    return await returnValue;
}

async function main(parrams) {
    var mssv = parrams.mssv;
    var response;
    var flag;
    if (mssv == 0) {
        response = await getNews();
        flag = 0;
    } else {
        response = await getStudent(mssv);
        flag = mssv;
    }
    var object = { flag: flag, content: JSON.parse(response) };
    console.log(object);
    return object;
}
