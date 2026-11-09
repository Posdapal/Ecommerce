const orderController = require("../controller/order.controller");
const authuserMiddleware = require("../middleware/authuserMiddleware");

const orders = (app) => {
    app.get("/api/orders", authuserMiddleware, orderController.getAllOrders);
    app.get("/api/orders/:order_id", authuserMiddleware, orderController.getOneOrder);
}

module.exports = orders;