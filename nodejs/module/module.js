function newBrowser() {
    return { newPage: 'new page' };
}

var agent = 'chrome';

module.exports.browser = {
    agent: agent
};
module.exports.newBrowser = newBrowser;
