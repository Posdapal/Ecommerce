const db = require("../config/db")

const getAll = (req, res) => {
    var sql = "SELECT * FROM users"
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
    const {user_id} = req.params;
    var sql = "SELECT * From users WHERE user_id = ?";
    var param = [user_id]
    db.query(sql, param, (error, rows) => {
        if(!error) {
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

// mutiple export
module.exports = {
    getAll,
    getOne
}