const getPage = require("./index");

test("Returns given page", () => {
    pages = ["signup", "verifyemail", "login", "resetrequest", "resetpassword", "logout", "delete", "update"];
    for (let i = 0; i < pages.length; i++) {
        pageName = pages[i];
        expect(getPage(pageName)).toBe("/"+pageName);
    }
    
});