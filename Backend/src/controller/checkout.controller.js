// const Stripe = require('stripe');
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// const db = require("../config/db");

// // code for explain soon
// const stripePayment = async (req, res) => {
//     const { amount } = req.body;

//     try {
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amount * 100,
//             currency: 'usd',
//         });

//         res.json({
//             clientSecret: paymentIntent.client_secret
//         });
//     } catch (error) {
//         res.status(500).json(error);
//     }
// }

// const filladdress = (req, res) => {

//     const user_id = req.user.user_id;

//     const { full_name, phone, address, city } = req.body

//     var param = [user_id, full_name, phone, address, city];

//     const sql = `
//          INSERT INTO delivery_addresses(
//            user_id,
//            full_name,
//            phone,
//            address,
//            city
//          )
//          VALUES(?,?,?,?,?)
//     `;

//     db.query(sql, param, (err, result) => {
//         if (err) {
//             return res.status(500).json(err);
//         }

//         res.json({
//             message: "Address added successfully",
//             address_id: result.insertId
//         })
//     })
// }

// const getAllAddress = (req, res) => {
//     var sql = "SELECT * FROM delivery_addresses"

//     db.query(sql, (error, result) => {
//         if (!error) {
//             res.json({
//                 list: result
//             })
//         } else {
//             res.json({
//                 error: true,
//                 message: error
//             })
//         }
//     })
// }

// const getOneAddress = (req, res) => {
//     const { address_id } = req.params;
//     var sql = "SELECT * FROM delivery_addresses WHERE address_id = ?";
//     var param = { address_id }
//     db.query(sql, param, (error, result) => {
//         if (!error) {
//             res.json({
//                 list: rows
//             })
//         } else {
//             res.json({
//                 error: true,
//                 message: error
//             })
//         }
//     })
// }

// // tmr check probelem with this function
// // code for explain soon
// const checkout = (req, res) => {

//     const user_id = req.user.user_id;
//     var param = [user_id];
//     const { address_id, payment_method } = req.body;
//     var param2 = [address_id, payment_method];
//     // const {subtotal, delivery_fee, final_total} = req.body;
//     // var param3 = [user_id, address_id, subtotal, delivery_fee, final_total, payment_method];

//     const cartSql = `
//           SELECT
//             cart_items.*,
//             products.price
//         FROM carts
//         JOIN cart_items
//         ON carts.cart_id = cart_items.cart_id
//         JOIN products
//         ON products.product_id = cart_items.product_id
//         WHERE carts.user_id=?
//     `;

//     db.query(cartSql, param, (err, items) => {

//         let subtotal = 0;

//         items.forEach(item => {
//             subtotal += Number(item.price) * item.quantity;
//         });

//         let delivery_fee = 2;

//         if (subtotal > 50) {
//             delivery_fee = 0;
//         }

//         const final_total = subtotal + delivery_fee;

//         const orderSql = `
//            INSERT INTO orders(
//             user_id,
//             address_id,
//             subtotal,
//             delivery_fee,
//             final_total,
//             payment_method
//            )
//            VALUES(?,?,?,?,?,?)
//         `;

//         db.query(orderSql, [user_id, address_id, subtotal, delivery_fee, final_total, payment_method], (err, result) => {
//             const order_id = result.insertId;

//             items.forEach(item => {

//                 db.query(
//                     `
//                     INSERT INTO order_items(
//                         order_id,
//                         product_id,
//                         quantity,
//                         price
//                     )
//                     VALUES(?,?,?,?)
//                     `,
//                     [order_id, item.product_id, item.quantity, item.price],
//                 )
//             });

//             db.query(
//                 `
//                 INSERT INTO payments(
//                      order_id,
//                      payment_method,
//                      amount,
//                      payment_status
//                 )
//                 VALUES(?,?,?,?)
//                 `,
//                 [order_id, payment_method, final_total, 'PAID'],
//             );

//             db.query(
//                 `
//                 DELETE cart_items
//                 FROM cart_items
//                 JOIN carts
//                 ON carts.cart_id = cart_items.cart_id
//                 WHERE carts.user_id=?
//                 `,
//                 param
//             );

//             res.json({
//                 message: "Order Success",
//                 order_id,
//                 subtotal,
//                 delivery_fee,
//                 final_total
//             });
//         })
//     })
// }

// module.exports = {
//     stripePayment,
//     checkout,
//     filladdress,
//     getAllAddress,
//     getOneAddress
// }


const { BakongKHQR, khqrData, IndividualInfo } = require("bakong-khqr");
const db = require("../config/db");

/* ------------------------------------------------------------------
   SETTINGS (put these in your .env file)

   BAKONG_ACCOUNT_ID = yourname@abaa     <- your own ABA KHQR account id
   BAKONG_MERCHANT_NAME = Your Name      <- name shown in the ABA app
   BAKONG_MERCHANT_CITY = PHNOM PENH
   BAKONG_TOKEN = eyJ...                 <- token from https://api-bakong.nbc.gov.kh/register
   USD_TO_KHR = 4100                     <- your own exchange rate
   SKIP_PAYMENT_CHECK = true             <- ONLY for testing on your laptop
------------------------------------------------------------------- */

const USD_TO_KHR = Number(process.env.USD_TO_KHR) || 4100;
const QR_LIFETIME_MS = 5 * 60 * 1000; // QR is valid for 5 minutes

// remember every QR we create: md5 -> { user_id, total_usd, expiresAt }
// (it is cleared when the server restarts. For a real shop save it in a DB table)
const pendingPayments = new Map();

// small helper so we can use async/await with db.query
const query = (sql, params) =>
    new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => (err ? reject(err) : resolve(result)));
    });

// get the cart of this user and calculate the money on the SERVER
// (never trust the amount sent from the browser)
const getCartTotals = async (user_id) => {
    const items = await query(
        `
        SELECT cart_items.*, products.price
        FROM carts
        JOIN cart_items ON carts.cart_id = cart_items.cart_id
        JOIN products ON products.product_id = cart_items.product_id
        WHERE carts.user_id = ?
        `,
        [user_id]
    );

    let subtotal = 0;
    items.forEach((item) => {
        subtotal += Number(item.price) * item.quantity;
    });

    const delivery_fee = subtotal > 50 ? 0 : 2; // free delivery over $50
    const final_total = subtotal + delivery_fee;

    return { items, subtotal, delivery_fee, final_total };
};

// ask Bakong: did this QR get paid?
const isPaidOnBakong = async (md5) => {
    // testing only: pretend every QR is paid
    if (process.env.SKIP_PAYMENT_CHECK === "true") return true;

    const response = await fetch("https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.BAKONG_TOKEN}`,
        },
        body: JSON.stringify({ md5 }),
    });

    const result = await response.json();
    return result.responseCode === 0; // 0 = transaction found = paid
};

/* ------------------------------------------------------------------
   1) Create the ABA QR (replaces stripePayment)
   POST /api/checkout/aba-qr      body: { currency: "USD" | "KHR" }
------------------------------------------------------------------- */
const abaQrPayment = async (req, res) => {
    const user_id = req.user.user_id;
    const currency = req.body.currency === "KHR" ? "KHR" : "USD";

    try {
        const { items, final_total } = await getCartTotals(user_id);

        if (items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        // work out the amount in the chosen currency
        let amount;
        if (currency === "KHR") {
            amount = Math.ceil((final_total * USD_TO_KHR) / 100) * 100; // round up to 100 riel
        } else {
            amount = Number(final_total.toFixed(2));
        }

        const expiresAt = Date.now() + QR_LIFETIME_MS;

        const info = new IndividualInfo(
            process.env.BAKONG_ACCOUNT_ID,
            process.env.BAKONG_MERCHANT_NAME,
            process.env.BAKONG_MERCHANT_CITY || "PHNOM PENH",
            {
                currency: currency === "KHR" ? khqrData.currency.khr : khqrData.currency.usd,
                amount,
                expirationTimestamp: expiresAt,
            }
        );

        const khqr = new BakongKHQR();
        const result = khqr.generateIndividual(info);

        if (!result || !result.data) {
            return res.status(500).json({
                message: "Could not create QR",
                detail: result && result.status,
            });
        }

        const { qr, md5 } = result.data;

        pendingPayments.set(md5, { user_id, total_usd: final_total, expiresAt });

        res.json({ qr, md5, amount, currency, expiresAt });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Could not create QR" });
    }
};

/* ------------------------------------------------------------------
   2) Browser asks every 3 seconds: is it paid yet?
   POST /api/checkout/check-payment      body: { md5 }
------------------------------------------------------------------- */
const checkPayment = async (req, res) => {
    const user_id = req.user.user_id;
    const { md5 } = req.body;

    const pending = pendingPayments.get(md5);

    if (!pending || pending.user_id !== user_id) {
        return res.status(404).json({ message: "QR not found" });
    }

    if (Date.now() > pending.expiresAt) {
        return res.json({ paid: false, expired: true });
    }

    try {
        const paid = await isPaidOnBakong(md5);
        res.json({ paid, expired: false });
    } catch (error) {
        console.log(error);
        res.json({ paid: false, expired: false }); // try again on the next check
    }
};

/* ------------------------------------------------------------------
   3) Save the address
   POST /api/checkout/filladdress
------------------------------------------------------------------- */
const filladdress = (req, res) => {
    const user_id = req.user.user_id;
    const { full_name, phone, address, city } = req.body;

    const sql = `
        INSERT INTO delivery_addresses(user_id, full_name, phone, address, city)
        VALUES(?,?,?,?,?)
    `;

    db.query(sql, [user_id, full_name, phone, address, city], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Address added successfully",
            address_id: result.insertId,
        });
    });
};

// only the addresses of the logged in user
const getAllAddress = (req, res) => {
    const user_id = req.user.user_id;

    db.query("SELECT * FROM delivery_addresses WHERE user_id = ?", [user_id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: true, message: error });
        }

        res.json({ list: result });
    });
};

const getOneAddress = (req, res) => {
    const user_id = req.user.user_id;
    const { address_id } = req.params;

    db.query(
        "SELECT * FROM delivery_addresses WHERE address_id = ? AND user_id = ?",
        [address_id, user_id],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: true, message: error });
            }

            res.json({ list: result });
        }
    );
};

/* ------------------------------------------------------------------
   4) Save the order (used by BOTH QR payment and cash payment)
   payment_status: "PAID" for QR, "PENDING" for cash
   (with cash, the delivery person collects the money)
------------------------------------------------------------------- */
const createOrder = async ({ user_id, address_id, payment_method, payment_status, expectedTotal }) => {
    // a) the address must belong to this user
    const addr = await query(
        "SELECT address_id FROM delivery_addresses WHERE address_id = ? AND user_id = ?",
        [address_id, user_id]
    );
    if (addr.length === 0) throw new Error("ADDRESS_NOT_FOUND");

    // b) read the cart and calculate the money on the server
    const { items, subtotal, delivery_fee, final_total } = await getCartTotals(user_id);
    if (items.length === 0) throw new Error("EMPTY_CART");

    // c) QR only: the cart must be the same as when the QR was made
    if (expectedTotal !== undefined && Math.abs(final_total - expectedTotal) > 0.001) {
        throw new Error("CART_CHANGED");
    }

    // d) save the order
    const orderResult = await query(
        `
        INSERT INTO orders(user_id, address_id, subtotal, delivery_fee, final_total, payment_method)
        VALUES(?,?,?,?,?,?)
        `,
        [user_id, address_id, subtotal, delivery_fee, final_total, payment_method]
    );
    const order_id = orderResult.insertId;

    for (const item of items) {
        await query(
            "INSERT INTO order_items(order_id, product_id, quantity, price) VALUES(?,?,?,?)",
            [order_id, item.product_id, item.quantity, item.price]
        );
    }

    await query(
        "INSERT INTO payments(order_id, payment_method, amount, payment_status) VALUES(?,?,?,?)",
        [order_id, payment_method, final_total, payment_status]
    );

    // e) empty the cart
    await query(
        `
        DELETE cart_items
        FROM cart_items
        JOIN carts ON carts.cart_id = cart_items.cart_id
        WHERE carts.user_id = ?
        `,
        [user_id]
    );

    return { order_id, subtotal, delivery_fee, final_total, payment_method };
};

// turn our error codes into a message for the browser
const orderErrorMessages = {
    ADDRESS_NOT_FOUND: "Address not found",
    EMPTY_CART: "Your cart is empty",
    CART_CHANGED: "Your cart changed after the QR was created",
};

const sendOrderError = (res, error) => {
    const message = orderErrorMessages[error.message];
    if (message) {
        return res.status(400).json({ message });
    }
    console.log(error);
    res.status(500).json({ message: "Could not create the order" });
};

/* ------------------------------------------------------------------
   5) Order paid by ABA QR (only after the QR is really paid)
   POST /api/checkout      body: { address_id, payment_method, md5 }
------------------------------------------------------------------- */
const checkout = async (req, res) => {
    const user_id = req.user.user_id;
    const { address_id, md5 } = req.body;
    const payment_method = req.body.payment_method === "ABA_QR_KHR" ? "ABA_QR_KHR" : "ABA_QR_USD";

    try {
        // this QR must be ours
        const pending = pendingPayments.get(md5);
        if (!pending || pending.user_id !== user_id) {
            return res.status(400).json({ message: "Payment not found" });
        }

        // ask Bakong again (do not trust the browser)
        const paid = await isPaidOnBakong(md5);
        if (!paid) {
            return res.status(402).json({ message: "Payment not received yet" });
        }

        const result = await createOrder({
            user_id,
            address_id,
            payment_method,
            payment_status: "PAID",
            expectedTotal: pending.total_usd,
        });

        pendingPayments.delete(md5); // this QR cannot be used again

        res.json({ message: "Order Success", ...result });
    } catch (error) {
        sendOrderError(res, error);
    }
};

/* ------------------------------------------------------------------
   6) Order paid with CASH (Cash on Delivery)
   POST /api/checkout/cash      body: { address_id }
------------------------------------------------------------------- */
const cashCheckout = async (req, res) => {
    const user_id = req.user.user_id;
    const { address_id } = req.body;

    try {
        const result = await createOrder({
            user_id,
            address_id,
            payment_method: "CASH",
            payment_status: "PENDING", // not paid yet, the money is collected on delivery
        });

        res.json({ message: "Order Success", ...result });
    } catch (error) {
        sendOrderError(res, error);
    }
};

// const getMyOrders = (req, res) => {
//     const user_id = req.user.user_id;

//     db.query(
//         "SELECT * FROM orders WHERE user_id = ? ORDER BY order_id DESC",
//         [user_id],
//         (error, result) => {
//             if (error) {
//                 console.log(error);
//                 return res.status(500).json({ message: "Could not load orders" });
//             }

//             res.json({ list: result });
//         }
//     );
// };


module.exports = {
    abaQrPayment,
    checkPayment,
    checkout,
    cashCheckout,
    filladdress,
    getAllAddress,
    getOneAddress,
    // getMyOrders,   // <-- add
};