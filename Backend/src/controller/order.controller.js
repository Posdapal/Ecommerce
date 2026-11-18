const db = require("../config/db");

// the only values the admin is allowed to save
const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_STATUSES = ["PENDING", "PAID"];

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

// GET /api/myorders  -> only the orders of the LOGGED-IN customer (newest first)
// req.user.user_id comes from authuserMiddleware (the token), so nobody can see another person's orders
const getMyOrders = (req, res) => {
    const user_id = req.user.user_id;
    const sql = `
        SELECT o.*, p.payment_status
        FROM orders o
        LEFT JOIN payments p ON p.order_id = o.order_id
        WHERE o.user_id = ?
        ORDER BY o.order_id DESC
    `;

    db.query(sql, [user_id], (error, result) => {
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

// ---------------------------------------------------------------
// PUT /api/orders/:order_id   (admin only)
// body can have:  order_status   -> "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
//                 payment_status -> "PENDING" | "PAID"
// ---------------------------------------------------------------
const updateOrder = async (req, res) => {
    const { order_id } = req.params;
    const { order_status, payment_status } = req.body || {};

    // 1) check what the admin sent
    if (order_status === undefined && payment_status === undefined) {
        return res.status(400).json({ message: "Nothing to update" });
    }
    if (order_status !== undefined && !ORDER_STATUSES.includes(order_status)) {
        return res.status(400).json({ message: `Order status must be one of: ${ORDER_STATUSES.join(", ")}` });
    }
    if (payment_status !== undefined && !PAYMENT_STATUSES.includes(payment_status)) {
        return res.status(400).json({ message: `Payment status must be one of: ${PAYMENT_STATUSES.join(", ")}` });
    }

    try {
        // 2) does this order exist?
        const found = await query("SELECT order_id FROM orders WHERE order_id = ?", [order_id]);
        if (found.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        // 3) save the new order status
        if (order_status !== undefined) {
            await query("UPDATE orders SET order_status = ? WHERE order_id = ?", [order_status, order_id]);
        }

        // 4) save the new payment status (it lives in the payments table)
        if (payment_status !== undefined) {
            await query("UPDATE payments SET payment_status = ? WHERE order_id = ?", [payment_status, order_id]);
        }

        res.json({ message: "Order updated", order_id: Number(order_id), order_status, payment_status });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Could not update the order" });
    }
};

module.exports = { getAllOrders, getMyOrders, getOneOrder, updateOrder };