const authUserController = require("../controller/authuser.controller");
const authuserMiddleware = require("../middleware/authuserMiddleware");

const users = (app) => {
    app.post("/api/user/register", authUserController.register);
    app.post("/api/user/login", authUserController.login);
    app.get("/api/user/profile", authuserMiddleware, authUserController.profile);
}

module.exports = users;