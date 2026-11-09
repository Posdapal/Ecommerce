const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');   // add this line
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}))

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const admin = require("./src/route/authadmin.route");
const users = require("./src/route/authuser.route");
const user = require("./src/route/user.route");
const categories = require("./src/route/category.route");
const products = require("./src/route/product.route");
const cart = require("./src/route/cart.route");
const checkout = require("./src/route/checkout.route");
const orders = require("./src/route/order.route");
const dashboard = require('./src/route/dashboard.route')

// call route from file authadmin.route.js
admin(app);
users(app);
user(app);
categories(app);
products(app);
cart(app);
checkout(app);   
orders(app);
dashboard(app);

app.listen(process.env.PORT, () => {
    console.log(`Server Running ${process.env.PORT}`);
});


// Note: dotenv.config();

// This line reads the .env file.

// It loads variables into:

// process.env