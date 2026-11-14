const db = require("../config/db")

const getAll = (req, res) => {
    var sql = "SELECT * FROM products"
    db.query(sql, (error, rows) => {
        if (!error) {
            res.json({
                list: rows
            })
        } else {
            res.json({
                error: true,
                message: error
            })
        }
    })
}

const getOne = (req, res) => {
    const { product_id } = req.params;
    var sql = "SELECT * From products WHERE product_id = ?";
    var param = [product_id]
    db.query(sql, param, (error, rows) => {
        if (!error) {
            res.json({
                list: rows
            })
        } else {
            res.json({
                error: true,
                message: error
            })
        }
    })
}

const create = (req, res) => {
    const {
        name, price, category_id, description
    } = req.body

     // uploaded image filename
    const image = req.file ? req.file.filename : null;

    var sql = "INSERT INTO products(name, price, image, category_id, description) VALUES(?, ?, ?, ?, ?)";
    var param = [name, price, image, category_id, description];
    db.query(sql, param, (error, rows) => {
        if (!error) {
            res.json({
                // short condition
                message: (rows.affectedRows != 0 ? "Insert success!" : "Something wrong!"),
                data: rows,
            })
        } else {
            res.json({
                error: true,
                message: error
            })
        }
    })
}

const remove = (req, res) => {
    const { product_id } = req.params;
    var sql = "DELETE FROM products WHERE product_id = ?";
    var param = [product_id];
    db.query(sql, param, (error, rows) => {
        if (!error) {
            res.json({
                // check condition if id is not equal 0 is true then remove success and false employee not found
                message: rows.affectedRows != 0 ? "Remove success" : "Product not found",
                data: rows
            })
        } else {
            res.json({
                error: true,
                message: error
            })
        }
    })
}

const update = (req, res) => {
    const {
        name, price, category_id, description
    } = req.body;
    const { product_id } = req.params;

    var sql;
    var param;
    if(req.file){
        // user choose a new image -> update image + name + description
        sql = "UPDATE products SET name=?, price=?, image=?, category_id=?, description=? WHERE product_id=?"
        param = [name, price, req.file.filename, category_id, description, product_id]
    } else {
        // no new image -> do NOT touch the imag column, keep the old one
        sql = "UPDATE products SET name=?, price=?, category_id=?, description=? WHERE product_id=?";
        param = [name, price, category_id, description, product_id]
    }
    // const image = req.file ? req.file.filename : null;
    // var sql = "UPDATE products SET name=?, price=?, image=?, category_id=? WHERE product_id=?";
    // var param = [name, price, image, category_id, product_id];
    db.query(sql, param, (error, rows) => {
        if (!error) {
            res.json({
                // check condition if id is not equal 0 is true then remove success and false employee not found
                message: rows.affectedRows != 0 ? "Update success" : "Product not found",
                data: rows
            })
        } else {
            res.json({
                error: true,
                message: error
            })
        }
    })
}

// mutiple export 
module.exports = {
    getAll,
    getOne,
    create,
    remove,
    update
}