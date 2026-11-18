const orderController = require("../controller/order.controller");
const authuserMiddleware = require("../middleware/authuserMiddleware");
const adminMiddleware = require("../middleware/authadminMiddleware");

const orders = (app) => {
    // authuserMiddleware = "you are logged in"
    // adminMiddleware    = "and you are the admin"
    // customer: only my own orders (used by the notification bell). No adminMiddleware here.
    app.get("/api/myorders", authuserMiddleware, orderController.getMyOrders);

    app.get("/api/orders", authuserMiddleware, adminMiddleware, orderController.getAllOrders);
    app.get("/api/orders/:order_id", authuserMiddleware, adminMiddleware, orderController.getOneOrder);
    app.put("/api/orders/:order_id", authuserMiddleware, adminMiddleware, orderController.updateOrder);   // NEW
}

module.exports = orders;