const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const SAVE_CAPTCHA_TO = "tmp/temp.png";
const MAX_TRY_CAPTCHA_COUNT = 10;

const LOGIN_URL = "https://ctt-sis.hust.edu.vn/Account/Login.aspx";
const LOGOUT_URL = "https://ctt-sis.hust.edu.vn/Account/Logout.aspx";
const STUDENT_TIMETABLE_URL = "https://ctt-sis.hust.edu.vn/Students/Timetables.aspx";
const STUDENT_PROGRAM_URL = "https://ctt-sis.hust.edu.vn/Students/StudentProgram.aspx";

async function captchaToText(filepath) {
    const url = "https://captcha2text.tuana9a.tech/api/captcha-to-text";
    const data = new FormData();
    data.append("file", fs.createReadStream(filepath));
    const headers = data.getHeaders();
    return axios.post(url, data, { headers: headers }).then(function (response) {
        let data = response.data;
        let value = String(data)
            .trim()
            .replace(/\s{2,}/g, " ");
        return value;
    });
}

/**
 * đăng nhập tự động vào trang web nhà trường
 * @param {TaskOpt} taskOpt
 *
 */
async function loginOnce(taskOpt) {
    const page = taskOpt.page;
    const entry = taskOpt.entry;
    let captchaPath = SAVE_CAPTCHA_TO;
    const $captchaImg = "#ctl00_ctl00_contentPane_MainPanel_MainContent_ASPxCaptcha1_IMG";
    let captchaImgElement = await page.$($captchaImg);
    await captchaImgElement.screenshot({ path: captchaPath, type: "png" });
    let captchaToTextResult = await captchaToText(captchaPath);
    // click option 3 times
    const $loginRoleOption = "#ctl00_ctl00_contentPane_MainPanel_MainContent_rblAccountType_RB0";
    await page.click($loginRoleOption);
    // type username
    const $inputUsername = "#ctl00_ctl00_contentPane_MainPanel_MainContent_tbUserName_I";
    await page.click($inputUsername, { clickCount: 3 });
    await page.type($inputUsername, entry.username);
    // type password
    const $inputPassword = "#ctl00_ctl00_contentPane_MainPanel_MainContent_tbPassword_I_CLND";
    await page.type($inputPassword, entry.password);
    // type captcha
    const $inputCaptcha = "#ctl00_ctl00_contentPane_MainPanel_MainContent_ASPxCaptcha1_TB_I";
    await page.type($inputCaptcha, captchaToTextResult);
    // EXPLAIN: mệt vlon
    const $loginButton = "#ctl00_ctl00_contentPane_MainPanel_MainContent_btLogin_CD";
    await Promise.all([page.click($loginButton), page.waitForNavigation({ waitUntil: "networkidle2" })]);

    // EXPLAIN: check login success
    if (page.url() == LOGIN_URL) {
        //EXPLAIN: nếu vẫn ở màn hình đăng nhập có thể có lỗi
        const $responseCaptchaMessage = "#ctl00_ctl00_contentPane_MainPanel_MainContent_ASPxCaptcha1_TB_EC";
        let responseCaptchaMessage = await page.$eval($responseCaptchaMessage, (e) => e.textContent);
        if (responseCaptchaMessage) {
            entry.isCaptchaError = true;
            entry.errorMessage = responseCaptchaMessage;
        }
        const $responseAccountMessage = "#ctl00_ctl00_contentPane_MainPanel_MainContent_FailureText";
        let responseAccountMessage = await page.$eval($responseAccountMessage, (e) => e.textContent);
        if (responseAccountMessage) {
            entry.isAccountError = true;
            entry.errorMessage = responseAccountMessage;
        }
    }
    return entry;
}

/**
 * đăng nhập tới khi thành công hoặc cõ lỗi xảy ra
 * @param {TaskOpt} taskOpt
 */
async function loginUntilSuccess(taskOpt) {
    const page = taskOpt.page;
    const entry = taskOpt.entry;
    //EXPLAIN: vẫn phải try catch vì goto có thể đã failed
    await page.bringToFront();
    await page.goto(LOGIN_URL);
    await page.waitForTimeout(1000);
    // bắt đầu thực thi vòng lặp
    while (entry.tryCaptchaCount < MAX_TRY_CAPTCHA_COUNT) {
        entry.tryCaptchaCount = entry.tryCaptchaCount + 1;
        await loginOnce(taskOpt);
        if (entry.isAccountError) {
            // nếu user sai thì k quan tâm captcha phải break luôn và không làm gì cả
            return entry;
        }
        if (entry.isCaptchaError) {
            // nếu là lỗi captcha thì tiếp tục vòng lặp cho tới khi max retry captcha reach
            continue;
        }
        // nếu captcha không sai (cả user và captcha đều đúng ok chuyển tiếp)
        break;
    }
    return entry;
}

/**
 * "cào" thời khoá biểu kì học hiện tại
 * @param {TaskOpt} taskOpt
 */
async function crawlTimeTable(taskOpt) {
    const page = taskOpt.page;
    await page.goto(STUDENT_TIMETABLE_URL);
    let classes = await page.evaluate(function () {
        //CAUTION: browser scope not nodejs scope
        let classes = [];
        const selectorTable = "#ctl00_ctl00_contentPane_MainPanel_MainContent_gvStudentRegister_DXMainTable";
        let table = document.querySelector(selectorTable);
        let rows = table.querySelectorAll(".dxgvDataRow_Mulberry");
        rows.forEach(function (row) {
            let values = Array.from(row.querySelectorAll(".dxgv"))
                .map((col) => col.textContent)
                .map((col) => col.trim().replace(/\s{2,}/g, " "));
            classes.push({
                ThoiGianHoc: values[0],
                HocVaoCacTuan: values[1],
                PhongHoc: values[2],
                MaLop: values[3],
                LoaiLop: values[4],
                Nhom: values[5],
                MaHocPhan: values[6],
                TenHocPhan: values[7],
                GhiChu: values[8],
            });
        });
        return classes;
    });

    return classes;
}

/**
 * "cào" thông tin về chương trình học của sinh viên
 * @param {TaskOpt} taskOpt
 */
async function crawlStudentProgram(taskOpt) {
    const page = taskOpt.page;
    await page.goto(STUDENT_PROGRAM_URL);
    let classes = await page.evaluate(function () {
        //CAUTION: browser scope not nodejs scope
        let classes = [];
        let selector = "#ctl00_ctl00_contentPane_MainPanel_MainContent_ProgramCoursePanel_gvStudentProgram_DXMainTable";
        let table = document.querySelector(selector);
        let rows = table.querySelectorAll(".dxgvDataRow");
        rows.forEach(function (row) {
            let values = Array.from(row.querySelectorAll(".dxgv"))
                .map((col) => col.textContent)
                .map((col) => col.trim().replace(/\s{2,}/g, " "));
            let classs = {
                MaHocPhan: values[2],
                TenHocPhan: values[3],
                KyHoc: values[4],
                BatBuoc: values[5],
                TinChiDaoTao: values[6],
                TinChiHoc: values[7],
                MaHocPhan: values[8],
                LoaiHocPhan: values[9],
                DiemChu: values[10],
                DiemSo: values[11],
                KhoaVien: values[12],
            };
            classes.push(classs);
        });
        return classes;
    });

    return classes;
}

/**
 * đăng nhập tự động vào trang web nhà trường
 * @param {TaskOpt} taskOpt
 */
async function logout(taskOpt) {
    const page = taskOpt.page;
    const entry = taskOpt.entry;
    await page.goto(LOGOUT_URL);
    return entry;
}

module.exports = {
    name: "test",
    tasks: [
        { run: loginUntilSuccess, name: "loginUntilSuccess" },
        // { run: crawlTimeTable, name: "crawlTimeTable" },
        { run: logout, name: "logout" },
    ],
};
