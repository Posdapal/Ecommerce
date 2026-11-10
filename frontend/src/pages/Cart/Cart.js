// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_BASE = "http://localhost:8081";

// function Cart() {
//     const token = localStorage.getItem("token");
//     const [items, setItems] = useState([]);
//     const [subtotal, setSubtotal] = useState(0);

//     // get cart from backend
//     const loadCart = async () => {
//         try {
//             const res = await axios.get(`${API_BASE}/api/cart/view`, {
//                 headers: { Authorization: token },
//             });
//             setItems(res.data.items);
//             setSubtotal(res.data.subtotal);
//             window.dispatchEvent(new Event("cartUpdated")); // update header number
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         if (token) loadCart();
//     }, []);

//     // + button
//     const handleIncrease = async (cart_item_id) => {
//         await axios.put(`${API_BASE}/api/cart/update/${cart_item_id}`, {}, {
//             headers: { Authorization: token },
//         });
//         loadCart(); // refresh list
//     };

//     // - button
//     const handleDecrease = async (cart_item_id) => {
//         await axios.put(`${API_BASE}/api/cart/remove/${cart_item_id}`, {}, {
//             headers: { Authorization: token },
//         });
//         loadCart(); // refresh list
//     };

//     if (!token) return <h4 className="container" style={{ marginTop: "100px" }}>Please login first</h4>;


//     return (
//         <div className="container" style={{ marginTop: "100px" }}>
//             <h3>My Cart</h3>

//             {items.length === 0 && <p>Your cart is empty</p>}

//             {items.map((item) => (
//                 <div key={item.cart_item_id} className="d-flex align-items-center border-bottom py-3">
//                     <img
//                         src={`${API_BASE}/uploads/${item.image}`}
//                         alt={item.name}
//                         style={{ width: "80px", height: "80px", objectFit: "cover" }}
//                     />

//                     <div className="ms-3 flex-grow-1">
//                         <p className="mb-1">{item.name}</p>
//                         <p className="mb-0 text-muted">${item.price}</p>
//                     </div>

//                     <div className="d-flex align-items-center gap-2">
//                         <button className="btn btn-outline-dark btn-sm" onClick={() => handleDecrease(item.cart_item_id)}>-</button>
//                         <span>{item.quantity}</span>
//                         <button className="btn btn-outline-dark btn-sm" onClick={() => handleIncrease(item.cart_item_id)}>+</button>
//                     </div>

//                     <p className="mb-0 ms-4 fw-semibold">${item.subtotal}</p>
//                 </div>
//             ))}

//             <h5 className="text-end mt-3">Total: ${subtotal}</h5>
//         </div>
//     )
// }

// export default Cart

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = "http://localhost:8081";

function Cart() {
    const token = localStorage.getItem("token");
    const [items, setItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

    // get cart from backend
    const loadCart = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/cart/view`, {
                headers: { Authorization: token },
            });
            setItems(res.data.items);
            setSubtotal(res.data.subtotal);
            window.dispatchEvent(new Event("cartUpdated")); // update header number
        } catch (error) {
            console.log(error);
        }
    };

    const handleCheckout = () => {
        if (loadCart){
            window.location.href = "/checkout";
        }else {
            alert("Please add Item to cart")
        }
    }

    useEffect(() => {
        if (token) loadCart();
    }, []);

    // + button
    const handleIncrease = async (cart_item_id) => {
        await axios.put(`${API_BASE}/api/cart/update/${cart_item_id}`, {}, {
            headers: { Authorization: token },
        });
        loadCart();
    };

    // - button
    const handleDecrease = async (cart_item_id) => {
        await axios.put(`${API_BASE}/api/cart/remove/${cart_item_id}`, {}, {
            headers: { Authorization: token },
        });
        loadCart();
    };

    //  delete item
    const handleDelete = async (cart_item_id) => {
        await axios.delete(`${API_BASE}/api/cart/delete/${cart_item_id}`, {
            headers: { Authorization: token },
        });
        loadCart();
    }

    // total number of products (add up all quantities)
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

    /* ===== NOT LOGGED IN ===== */
    if (!token) {
        return (
            <div className="container text-center" style={{ marginTop: "120px" }}>
                <h4 className="fw-bold">Please login first</h4>
                <p className="text-muted">Login to see the items in your cart.</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: "100px", marginBottom: "60px" }}>

            {/* PAGE TITLE */}
            <div className="d-flex align-items-baseline justify-content-between mb-4">
                <h3 className="fw-bold mb-0">Shopping Cart</h3>
                <span className="text-muted">{totalQty} {totalQty === 1 ? "item" : "items"}</span>
            </div>

            {/* ===== EMPTY CART ===== */}
            {items.length === 0 ? (
                <div className="card border-0 shadow-sm rounded-4 text-center py-5">
                    <div className="card-body">
                        <h5 className="fw-bold">Your cart is empty</h5>
                        <p className="text-muted">Add some products and they will show up here.</p>
                        <Link to="/" className="btn btn-dark rounded-pill px-4">
                            Start shopping
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="row g-4">

                    {/* ===== LEFT: PRODUCT LIST ===== */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4">
                            <ul className="list-group list-group-flush rounded-4">

                                {items.map((item) => (
                                    <li key={item.cart_item_id} className="list-group-item p-3 p-md-4">
                                        <div className="row align-items-center g-3">

                                            {/* image */}
                                            <div className="col-4 col-md-2">
                                                <img
                                                    src={`${API_BASE}/uploads/${item.image}`}
                                                    alt={item.name}
                                                    className="img-fluid rounded-3 border"
                                                    style={{ aspectRatio: "1 / 1", objectFit: "cover", width: "100%" }}
                                                />
                                            </div>

                                            {/* name + unit price */}
                                            <div className="col-8 col-md-4">
                                                <h6 className="fw-semibold mb-1">{item.name}</h6>
                                                <p className="text-muted small mb-0">${item.price} each</p>
                                            </div>

                                            {/* quantity buttons */}
                                            <div className="col-6 col-md-3">
                                                <div className="input-group input-group-sm" style={{ maxWidth: "120px" }}>
                                                    <button
                                                        className="btn btn-outline-dark"
                                                        onClick={() => handleDecrease(item.cart_item_id)}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="form-control text-center bg-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        className="btn btn-outline-dark"
                                                        onClick={() => handleIncrease(item.cart_item_id)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* line total */}
                                            <div className="col-6 col-md-3 text-end">
                                                <span className="fw-bold fs-5">${item.subtotal}</span>

                                                <button
                                                    className="btn btn-outline-danger d-flex align-items-center justify-content-center p-0 position-absolute top-0 end-0 m-2"
                                                    style={{ width: "30px", height: "30px" }}
                                                    onClick={() => handleDelete(item.cart_item_id)}
                                                    title="Delete"
                                                    aria-label="Delete item"
                                                >
                                                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                                    </svg>
                                                </button>
                                            </div>

                                        </div>
                                    </li>
                                ))}

                            </ul>
                        </div>
                        <Link to="/" className="btn btn-dark rounded-3 px-4 mt-3">
                            ← Continue shopping
                        </Link>
                    </div>

                    {/* ===== RIGHT: ORDER SUMMARY ===== */}
                    <div className="col-lg-4">

                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">Order Summary</h5>

                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal ({totalQty} items)</span>
                                <span>${subtotal}</span>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between mb-4">
                                <span className="fw-bold fs-5">Total</span>
                                <span className="fw-bold fs-5">${subtotal}</span>
                            </div>

                            <button onClick={handleCheckout} className="btn btn-dark w-100 py-2 rounded-3 fw-semibold">
                                Checkout
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

export default Cart;