// const checkoutController = require("../controller/checkout.controller");
// const authuserMiddleware = require("../middleware/authuserMiddleware");

// const checkout = (app) => {
//     app.post("/api/checkout/stripe-payment", checkoutController.stripePayment);
//     app.post("/api/checkout", authuserMiddleware, checkoutController.checkout);
//     app.post("/api/checkout/filladdress", authuserMiddleware, checkoutController.filladdress);
//     app.get("/api/checkout/getalladdress", checkoutController.getAllAddress);
//     app.get("/api/checkout/getoneaddress/:address_id", checkoutController.getOneAddress);
// }

// module.exports = checkout;

const checkoutController = require("../controller/checkout.controller");
const authuserMiddleware = require("../middleware/authuserMiddleware");

const checkout = (app) => {
    // ABA QR (replaces /stripe-payment)
    app.post("/api/checkout/aba-qr", authuserMiddleware, checkoutController.abaQrPayment);
    app.post("/api/checkout/check-payment", authuserMiddleware, checkoutController.checkPayment);

    // order + address
    app.post("/api/checkout", authuserMiddleware, checkoutController.checkout);
    app.post("/api/checkout/cash", authuserMiddleware, checkoutController.cashCheckout);  // cash on delivery
    app.post("/api/checkout/filladdress", authuserMiddleware, checkoutController.filladdress);
    app.get("/api/checkout/getalladdress", authuserMiddleware, checkoutController.getAllAddress);
    app.get("/api/checkout/getoneaddress/:address_id", authuserMiddleware, checkoutController.getOneAddress);
}

module.exports = checkout;