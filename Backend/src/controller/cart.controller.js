const db = require('../config/db')

// code for explain soon
const addProducttoCart = (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.user.user_id;

    var sql = "SELECT * FROM carts WHERE user_id = ?";

    db.query(sql, [user_id], (error, rows) => {

        if (rows.length === 0) {
            db.query("INSERT INTO carts(user_id) VALUES(?)", [user_id], (error, rows) => {
                const cart_id = rows.insertId;
                addItem(cart_id);
            }
            );
        } else {
            addItem(rows[0].cart_id);
        }

        function addItem(cart_id) {
            // const {cart_id, product_id, quantity} = req.body;
            // const {cart_id} = req.params;
            const sql = "INSERT INTO cart_items(cart_id, product_id, quantity) VALUES(?, ?, ?)";
            var param = [cart_id, product_id, quantity];
            db.query(sql, param, (error, result) => {
                if (error) {
                    return res.status(500).json(error);
                }

                res.json({
                    message: "Product added to cart"
                })
            })
        }
    })
}

// code for explain soon
const getProductinCart = (req, res) => {

    const user_id = req.user.user_id;

    const sql = `
        SELECT 
        cart_items.cart_item_id,
        products.name,
        products.price,
        products.image,
        cart_items.quantity,
        (products.price * cart_items.quantity) AS subtotal
    FROM carts 
    JOIN cart_items
    ON carts.cart_id = cart_items.cart_id
    JOIN products
    ON products.product_id = cart_items.product_id
    WHERE carts.user_id = ?`;

    db.query(sql, [user_id], (error, result) => {
        if (error) {
            return res.status(500).json(error);
        }

        let total = 0;

        result.forEach(item => {
            total += item.subtotal;
        });

        res.json({
            items: result,
            subtotal: total,
        })
    })
}

// Note: 

// This:

// req.params.id

// comes from:

// cart_items.cart_item_id

// because your SQL query uses:

// WHERE cart_item_id=?

const increaseQuantity = (req, res) => {
    const sql = "UPDATE cart_items SET quantity = quantity + 1 WHERE cart_item_id = ? AND quantity >= 1";
    const { cart_item_id } = req.params;
    var param = [cart_item_id];
    db.query(sql, param, (error, result) => {
        if (error) {
            return res.json({
                error: true,
                message: error
            });
        }

        res.json({
            message: "Quantity Increase successfully"
        });
    })
}

const decreaseQuantity = (req, res) => {
    const { cart_item_id } = req.params;

    db.query(
        "UPDATE cart_items SET quantity = quantity - 1 WHERE cart_item_id = ?",
        [cart_item_id],
        (error) => {
            if (error) {
                return res.json({
                    error: true,
                    message: error
                });
            }

            db.query(
                "DELETE FROM cart_items WHERE cart_item_id = ? AND quantity <= 0",
                [cart_item_id],
                (error) => {
                    if (error) {
                        return res.json({
                            error: true,
                            message: error
                        });
                    }

                    res.json({
                        message: "Quantity decreased successfully"
                    });
                }
            );
        }
    );
}

const deleteItem = (req, res) => {
    const { cart_item_id } = req.params;

    const sql = "DELETE FROM cart_items WHERE cart_item_id = ?";

    db.query(sql, [cart_item_id], (error, result) => {
        if(error) {
            return res.status(500).json(error);
        }

        res.json({
            message: "Item deleted"
        })
    })
}

module.exports = {
    addProducttoCart,
    getProductinCart,
    increaseQuantity,
    decreaseQuantity,
    deleteItem
}

// Note: When using JWT authentication, the user identity should come from the token, not from the URL.

// After your middleware verifies the token:

// const verify = jwt.verify(
//     token,
//     process.env.JWT_SECRET
// );

// req.user = verify;

// req.user becomes:

// {
//     user_id: 1,
//     email: "user@gmail.com"
// }

// So use:

// const user_id = req.user.user_id;

// This is more secure because a user cannot change the URL to access another user's cart.

// Secure (recommended)
// POST /cart/add
// Authorization: Bearer TOKEN

// Get user:

// const user_id = req.user.user_id;
// Less secure
// POST /cart/add/1

// Get user:

// const { user_id } = req.params;

// A malicious user could change:

// /cart/add/1

// to:

// /cart/add/2

// and potentially access another user's data if you don't add extra checks.


// Note: First Query: Decrease Quantity
// db.query(
//     "UPDATE cart_items SET quantity = quantity - 1 WHERE cart_item_id = ?",
//     [cart_item_id],

// If the current data is:

// cart_item_id	quantity
// 1	5

// SQL becomes:

// UPDATE cart_items
// SET quantity = quantity - 1
// WHERE cart_item_id = 1

// Result:

// cart_item_id	quantity
// 1	4

// Every click on the - button decreases the quantity by 1.

// Check for Errors
// (error) => {
//     if (error) {

// If MySQL returns an error:

// return res.json({
//     error: true,
//     message: error
// });

// Example:

// {
//   "error": true,
//   "message": "Unknown column..."
// }

// The function stops here because of return.


// Note: Second Query: Delete When Quantity Is 0
// db.query(
//     "DELETE FROM cart_items WHERE cart_item_id = ? AND quantity <= 0",
//     [cart_item_id],

// Suppose quantity becomes:

// cart_item_id	quantity
// 1	0

// SQL becomes:

// DELETE FROM cart_items
// WHERE cart_item_id = 1
// AND quantity <= 0

// Result:

// The row is removed from the table.

// Why Use quantity <= 0?

// This covers both:

// quantity	Result
// 0	Delete
// -1	Delete
// -2	Delete

// So invalid negative quantities are also cleaned up.

// Check Delete Errors
// if (error) {
//     return res.json({
//         error: true,
//         message: error
//     });
// }

// If the delete query fails, return the error.

// Success Response
// res.json({
//     message: "Quantity decreased successfully"
// });

// Client receives:

// {
//   "message": "Quantity decreased successfully"
// }
