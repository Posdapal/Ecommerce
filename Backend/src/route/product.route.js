const productController = require("../controller/product.controller");
const upload = require("../middleware/upload");

const product = (app) => {
    app.get("/api/product", productController.getAll);
    app.get("/api/product/:product_id", productController.getOne);
    app.post("/api/product", upload.single("image"), productController.create);
    app.put("/api/product/:product_id", upload.single("image"), productController.update);
    app.delete("/api/product/:product_id", productController.remove);
}

module.exports = product