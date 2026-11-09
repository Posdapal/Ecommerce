const db = require("../config/db");

// GET /api/orders  -> all orders (newest first) with payment status
const getAllOrders = (req, res) => {
    const sql = `
        SELECT o.*, p.payment_status
        FROM orders o
        LEFT JOIN payments p ON p.order_id = o.order_id
        ORDER BY o.order_id DESC
    `;

    db.query(sql, (error, result) => {
        if (error) {
            return res.status(500).json({ error: true, message: error });
        }
        res.json({ list: result });
    });
};

// GET /api/orders/:order_id  -> one order + its items
const getOneOrder = (req, res) => {
    const { order_id } = req.params;

    db.query("SELECT * FROM orders WHERE order_id = ?", [order_id], (error, orders) => {
        if (error) {
            return res.status(500).json({ error: true, message: error });
        }
        if (orders.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        const sql = `
            SELECT order_items.*, products.name, products.image
            FROM order_items
            JOIN products ON products.product_id = order_items.product_id
            WHERE order_items.order_id = ?
        `;

        db.query(sql, [order_id], (error2, items) => {
            if (error2) {
                return res.status(500).json({ error: true, message: error2 });
            }
            res.json({ order: orders[0], items });
        });
    });
};

module.exports = { getAllOrders, getOneOrder };