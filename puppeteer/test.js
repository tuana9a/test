const puppeteer = require("puppeteer");

const jobModulePath = "./test.tasks.js";

const receiveData = {
    username: "20183656",
    password: "013685414",
    tryCaptchaCount: 0,
    isCaptchaError: false,
    isAccountError: false,
    errorMessage: "",
};

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 10,
    });
    const pages = await browser.pages();
    const page = pages[0];
    const job = require(jobModulePath);
    const taskOpt = { page: page, entry: receiveData };
    const tasks = job.tasks;
    for (const task of tasks) {
        const result = await task.run(taskOpt);
        console.log(result);
    }
    await browser.close();
}

main();
