const dashboardController = require("../controller/dashboard.controller");
const authuserMiddleware = require("../middleware/authuserMiddleware");

const dashboard = (app) => {
    app.get("/api/dashboard/summary", authuserMiddleware, dashboardController.loadSummary);
    app.get('/api/dashboard/getAllusers', authuserMiddleware, dashboardController.getAllUsers);
    app.get('/api/dashboard/getAllorders', authuserMiddleware, dashboardController.getAllOrders);
}

module.exports = dashboard;