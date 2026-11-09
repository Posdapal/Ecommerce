const db = require("../config/db")

const getAll = (req, res) => {
    var sql = "SELECT * FROM categories"
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
    const { category_id } = req.params;
    var sql = "SELECT * From categories WHERE category_id = ?";
    var param = [category_id]
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
        category_name, description
    } = req.body

    // uploaded image filename
    const image = req.file ? req.file.filename : null;

    var sql = "INSERT INTO categories(image, category_name, description) VALUES(?, ?, ?)";
    var param = [image, category_name, description];
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
    const { category_id } = req.params;
    var sql = "DELETE FROM categories WHERE category_id = ?";
    var param = [category_id];
    db.query(sql, param, (error, rows) => {
        if (!error) {
            res.json({
                // check condition if id is not equal 0 is true then remove success and false employee not found
                message: rows.affectedRows != 0 ? "Remove success" : "Category not found",
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
        category_name, description
    } = req.body;
    const { category_id } = req.params;

    var sql;
    var param;

    if (req.file) {
        // user chose a new image -> update image + name + description
        sql = "UPDATE categories SET image=?, category_name=?, description=? WHERE category_id=?";
        param = [req.file.filename, category_name, description, category_id];
    } else {
        // no new image -> do NOT touch the image column, keep the old one
        sql = "UPDATE categories SET category_name=?, description=? WHERE category_id=?";
        param = [category_name, description, category_id];
    }

    db.query(sql, param, (error, rows) => {
        if (!error) {
            res.json({
                // check condition if id is not equal 0 is true then remove success and false employee not found
                message: rows.affectedRows != 0 ? "Update success" : "Categories not found",
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