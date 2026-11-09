const userController = require("../controller/user.controller");

const user = (app) => {
    app.get("/api/user", userController.getAll);
    app.get("/api/user/:user_id", userController.getOne);
}

module.exports = user;