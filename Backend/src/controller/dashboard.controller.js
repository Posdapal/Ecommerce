const db = require('../config/db');

// small helper so we can use await with db.query
const query = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.query(sql, params, (error, result) => (error ? reject(error) : resolve(result)));
    });

// GET /api/dashboard/summary
// gives everything the Admin dashboard needs in ONE request
const loadSummary = async (req, res) => {
    try {
        // run all the queries at the same time (faster than one by one)
        const [
            users, products, categories, orders, revenue, pendingCash,
            recentOrders, topUsers, topProducts,
        ] = await Promise.all([
            // ----- numbers for the cards -----
            query("SELECT COUNT(*) AS total FROM users"),
            query("SELECT COUNT(*) AS total FROM products"),
            query("SELECT COUNT(*) AS total FROM categories"),
            query("SELECT COUNT(*) AS total FROM orders"),
            // money already received (QR paid)
            query("SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE payment_status = 'PAID'"),
            // money still to collect (cash on delivery)
            query("SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE payment_status = 'PENDING'"),

            // ----- the 6 newest orders, with the customer name -----
            query(`
                SELECT orders.order_id, orders.final_total, orders.payment_method,
                       users.username, payments.payment_status
                FROM orders
                JOIN users ON users.user_id = orders.user_id
                LEFT JOIN payments ON payments.order_id = orders.order_id
                ORDER BY orders.order_id DESC
                LIMIT 6
            `),

            // ----- the 6 users with the most orders (the password is NOT selected) -----
            query(`
                SELECT users.user_id, users.username, users.email, COUNT(orders.order_id) AS order_count
                FROM users
                LEFT JOIN orders ON orders.user_id = users.user_id
                GROUP BY users.user_id, users.username, users.email
                ORDER BY order_count DESC, users.user_id ASC
                LIMIT 6
            `),

            // ----- the 5 products people bought the most (for the chart) -----
            query(`
                SELECT products.name, SUM(order_items.quantity) AS total_ordered
                FROM order_items
                JOIN products ON products.product_id = order_items.product_id
                GROUP BY products.product_id, products.name
                ORDER BY total_ordered DESC
                LIMIT 5
            `),
        ]);

        res.json({
            total_users: users[0].total,
            total_products: products[0].total,
            total_categories: categories[0].total,
            total_orders: orders[0].total,
            total_revenue: Number(revenue[0].total),          // SUM comes back as text, so use Number()
            pending_cash: Number(pendingCash[0].total),

            recent_orders: recentOrders,
            top_users: topUsers,
            top_products: topProducts.map((p) => ({
                name: p.name,
                total_ordered: Number(p.total_ordered),
            })),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Could not load summary" });
    }
};

const getAllUsers = (req, res) => {
    // never send the password column to the browser
    var sql = "SELECT user_id, username, email, phone FROM users"
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

// all orders of the shop (for the admin), with the customer name
const getAllOrders = (req, res) => {

    const sql = `
        SELECT orders.*, users.username
        FROM orders
        JOIN users ON users.user_id = orders.user_id
        ORDER BY orders.order_id DESC
    `;

    db.query(sql, (error, result) => {
        if (error) {
            return res.status(500).json(error);
        }

        res.json(result);
    })
}

module.exports = {
    loadSummary,
    getAllUsers,
    getAllOrders,
};