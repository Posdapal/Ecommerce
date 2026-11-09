const authAdminController = require("../controller/authadmin.controller");
const authadminMiddleware = require("../middleware/authadminMiddleware");

const admin = (app) => {
    app.post("/api/admin/register", authAdminController.register);
    app.post("/api/admin/login", authAdminController.login);
    app.get("/api/admin/profile", authadminMiddleware, authAdminController.profile);
}

module.exports = admin;