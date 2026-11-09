const categoryController = require("../controller/category.controller");
const upload = require("../middleware/upload")

const category = (app) => {
    app.get("/api/category", categoryController.getAll);
    app.get("/api/category/:category_id", categoryController.getOne);
    app.post("/api/category", upload.single("image"), categoryController.create);
    app.put("/api/category/:category_id", upload.single("image"), categoryController.update);
    app.delete("/api/category/:category_id", categoryController.remove);
}

module.exports = category