const cartController = require('../controller/cart.controller');
const authuserMiddleware = require('../middleware/authuserMiddleware');

const cart = (app) => {
    app.post('/api/cart/add', authuserMiddleware, cartController.addProducttoCart);
    app.get('/api/cart/view', authuserMiddleware, cartController.getProductinCart);
    app.put('/api/cart/update/:cart_item_id', authuserMiddleware, cartController.increaseQuantity);
    app.put('/api/cart/remove/:cart_item_id', authuserMiddleware, cartController.decreaseQuantity);
    app.delete("/api/cart/delete/:cart_item_id", authuserMiddleware, cartController.deleteItem);
}

module.exports = cart;