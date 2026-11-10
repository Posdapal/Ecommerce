import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react'; // npm install qrcode.react
import OrderDone from '../OrderDone/OrderDone';
import { CashIcon, QrIcon } from './Paymenticons';

const API_BASE = "http://localhost:8081";

function Checkout() {
    const token = localStorage.getItem("token");
    const headers = { Authorization: token };

    // cart
    const [items, setItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

    // address
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ full_name: "", phone: "", address: "", city: "" });

    // payment
    const [paymentMethod, setPaymentMethod] = useState("QR"); // "QR" or "CASH"
    const [placingOrder, setPlacingOrder] = useState(false); // true while the cash order is saving
    const [currency, setCurrency] = useState("USD");   // "USD" or "KHR"
    const [qrData, setQrData] = useState(null);         // QR from the backend
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [loadingQr, setLoadingQr] = useState(false);
    const [message, setMessage] = useState("");
    const [order, setOrder] = useState(null);           // filled when order is done

    // money (same rule as the backend: free delivery over $50)
    const deliveryFee = subtotal > 50 || items.length === 0 ? 0 : 2;
    const finalTotal = Number(subtotal) + deliveryFee;

    // ---------- load cart + addresses ----------
    const loadCart = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/cart/view`, { headers });
            setItems(res.data.items);
            setSubtotal(res.data.subtotal);
        } catch (error) {
            console.log(error);
        }
    };

    const loadAddresses = async (selectId) => {
        try {
            const res = await axios.get(`${API_BASE}/api/checkout/getalladdress`, { headers });
            const list = res.data.list;
            setAddresses(list);
            if (selectId) {
                setSelectedAddress(selectId);
            } else if (list.length > 0) {
                setSelectedAddress(list[list.length - 1].address_id); // newest address
            } else {
                setShowForm(true); // no address yet, show the form
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (token) {
            loadCart();
            loadAddresses();
        }
    }, []);

    // ---------- save a new address ----------
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE}/api/checkout/filladdress`, form, { headers });
            setForm({ full_name: "", phone: "", address: "", city: "" });
            setShowForm(false);
            setMessage("");
            loadAddresses(res.data.address_id);
        } catch (error) {
            setMessage("Could not save the address");
        }
    };

    // ---------- create the QR ----------
    const handleCreateQr = async () => {
        if (!selectedAddress) {
            setMessage("Please choose a delivery address first");
            return;
        }
        setMessage("");
        setLoadingQr(true);
        try {
            const res = await axios.post(`${API_BASE}/api/checkout/aba-qr`, { currency }, { headers });
            setQrData({ ...res.data, address_id: selectedAddress });
        } catch (error) {
            setMessage(error.response?.data?.message || "Could not create the QR");
        }
        setLoadingQr(false);
    };

    // ---------- pay with cash (Cash on Delivery) ----------
    const handleCashOrder = async () => {
        if (!selectedAddress) {
            setMessage("Please choose a delivery address first");
            return;
        }
        setMessage("");
        setPlacingOrder(true);
        try {
            const res = await axios.post(
                `${API_BASE}/api/checkout/cash`,
                { address_id: selectedAddress },
                { headers }
            );
            setOrder(res.data);
            window.dispatchEvent(new Event("cartUpdated")); // reset the number on the header
        } catch (error) {
            setMessage(error.response?.data?.message || "Could not place the order");
        }
        setPlacingOrder(false);
    };

    // ---------- after the QR is shown: count down + ask "paid yet?" every 3 seconds ----------
    useEffect(() => {
        if (!qrData) return;

        let tick = 0;
        let busy = false;

        const timer = setInterval(async () => {
            tick++;

            const left = Math.max(0, Math.round((qrData.expiresAt - Date.now()) / 1000));
            setSecondsLeft(left);

            if (left === 0) {
                setQrData(null);
                setMessage("The QR has expired. Please create a new one.");
                return;
            }

            if (tick % 3 !== 0 || busy) return;
            busy = true;

            try {
                const check = await axios.post(
                    `${API_BASE}/api/checkout/check-payment`,
                    { md5: qrData.md5 },
                    { headers }
                );

                if (check.data.paid) {
                    clearInterval(timer);

                    const done = await axios.post(
                        `${API_BASE}/api/checkout`,
                        {
                            address_id: qrData.address_id,
                            payment_method: `ABA_QR_${qrData.currency}`,
                            md5: qrData.md5,
                        },
                        { headers }
                    );

                    setOrder(done.data);
                    setQrData(null);
                    window.dispatchEvent(new Event("cartUpdated")); // reset the number on the header
                    return;
                }
            } catch (error) {
                console.log(error);
            }

            busy = false;
        }, 1000);

        return () => clearInterval(timer);
    }, [qrData]);

    // format "4:59"
    const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

    /* ===== NOT LOGGED IN ===== */
    if (!token) {
        return (
            <div className="container text-center" style={{ marginTop: "120px" }}>
                <h4 className="fw-bold">Please login first</h4>
                <p className="text-muted">Login to continue to checkout.</p>
            </div>
        );
    }

    if (order) {
        return <OrderDone order={order} />;
    }


    /* ===== EMPTY CART ===== */
    if (items.length === 0) {
        return (
            <div className="container text-center" style={{ marginTop: "120px" }}>
                <h4 className="fw-bold">Your cart is empty</h4>
                <p className="text-muted">Add a product before you check out.</p>
                <Link to="/" className="btn btn-dark rounded-pill px-4">Start shopping</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: "100px", marginBottom: "60px" }}>

            <h3 className="fw-bold mb-4">Checkout</h3>

            {message && <div className="alert alert-danger py-2">{message}</div>}

            <div className="row g-4">

                {/* ===== LEFT SIDE ===== */}
                <div className="col-lg-8">

                    {/* ---------- 1. DELIVERY ADDRESS ---------- */}
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">Delivery address</h5>
                                {!showForm && !qrData && (
                                    <button
                                        className="btn btn-outline-dark btn-sm rounded-pill px-3"
                                        onClick={() => setShowForm(true)}
                                    >
                                        Add new address
                                    </button>
                                )}
                            </div>

                            {/* saved addresses */}
                            {addresses.map((a) => (
                                <label
                                    key={a.address_id}
                                    className={`d-flex align-items-start gap-3 border rounded-3 p-3 mb-2 ${selectedAddress === a.address_id ? "border-dark bg-light" : ""}`}
                                    role="button"
                                >
                                    <input
                                        type="radio"
                                        className="form-check-input mt-1"
                                        name="address"
                                        checked={selectedAddress === a.address_id}
                                        disabled={!!qrData}
                                        onChange={() => setSelectedAddress(a.address_id)}
                                    />
                                    <span>
                                        <span className="fw-semibold d-block">{a.full_name}</span>
                                        <span className="text-muted small d-block">{a.phone}</span>
                                        <span className="text-muted small d-block">{a.address}, {a.city}</span>
                                    </span>
                                </label>
                            ))}

                            {/* new address form */}
                            {showForm && (
                                <form onSubmit={handleSaveAddress} className="mt-2">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input
                                                    className="form-control" id="fullName" name="full_name"
                                                    placeholder="Full name" value={form.full_name}
                                                    onChange={handleChange} required
                                                />
                                                <label htmlFor="fullName">Full name</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input
                                                    className="form-control" id="phone" name="phone"
                                                    placeholder="Phone" value={form.phone}
                                                    onChange={handleChange} required
                                                />
                                                <label htmlFor="phone">Phone number</label>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="form-floating">
                                                <input
                                                    className="form-control" id="address" name="address"
                                                    placeholder="Address" value={form.address}
                                                    onChange={handleChange} required
                                                />
                                                <label htmlFor="address">Street, house number</label>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    className="form-control" id="city" name="city"
                                                    placeholder="City" value={form.city}
                                                    onChange={handleChange} required
                                                />
                                                <label htmlFor="city">City</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 mt-3">
                                        <button className="btn btn-dark rounded-3 px-4 fw-semibold">
                                            Save address
                                        </button>
                                        {addresses.length > 0 && (
                                            <button
                                                type="button"
                                                className="btn btn-dark border rounded-3 px-4"
                                                onClick={() => setShowForm(false)}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* ---------- 2. PAYMENT ---------- */}
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Payment method</h5>

                            {/* choose: ABA QR or cash (locked while a QR is waiting to be paid) */}
                            <div className="row g-2 mb-4">
                                <div className="col-sm-6">
                                    <input
                                        type="radio" className="btn-check" name="payMethod" id="payQr"
                                        checked={paymentMethod === "QR"} disabled={!!qrData}
                                        onChange={() => setPaymentMethod("QR")}
                                    />
                                    <label className="btn btn-outline-dark w-100 text-start p-3" htmlFor="payQr">
                                        <QrIcon size={32} />
                                        <span className="fw-semibold d-block">ABA QR</span>
                                        <span className="small">Scan and pay now (USD or KHR)</span>
                                    </label>
                                </div>
                                <div className="col-sm-6">
                                    <input
                                        type="radio" className="btn-check" name="payMethod" id="payCash"
                                        checked={paymentMethod === "CASH"} disabled={!!qrData}
                                        onChange={() => setPaymentMethod("CASH")}
                                    />
                                    <label className="btn btn-outline-dark w-100 text-start p-3" htmlFor="payCash">
                                        <CashIcon size={32} />
                                        <span className="fw-semibold d-block">Cash on delivery</span>
                                        <span className="small">Pay when your order arrives</span>
                                    </label>
                                </div>
                            </div>

                            {paymentMethod === "CASH" ? (
                                /* ===== CASH ===== */
                                <>
                                    <p className="text-muted small mb-3">
                                        Pay in cash when your order arrives. Please prepare the exact amount if you can.
                                    </p>

                                    <div className="d-flex justify-content-between align-items-center border rounded-3 p-3 mb-4">
                                        <span className="text-muted">Amount to pay on delivery</span>
                                        <span className="fw-bold fs-5">${finalTotal.toFixed(2)}</span>
                                    </div>

                                    <button
                                        className="btn btn-dark w-100 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                        onClick={handleCashOrder}
                                        disabled={placingOrder}
                                    >
                                        {placingOrder ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Placing order...
                                            </>
                                        ) : (
                                            <>
                                                <CashIcon size={20} />
                                                Place order · ${finalTotal.toFixed(2)}
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : !qrData ? (
                                <>
                                    <p className="text-muted small mb-2">
                                        Choose a currency. You will scan the QR with the ABA Mobile app (or any Bakong app).
                                    </p>

                                    {/* USD / KHR switch */}
                                    <div className="btn-group mb-4" role="group" aria-label="Currency">
                                        <input
                                            type="radio" className="btn-check" name="currency" id="curUsd"
                                            checked={currency === "USD"} onChange={() => setCurrency("USD")}
                                        />
                                        <label className="btn btn-outline-dark px-4" htmlFor="curUsd">USD ($)</label>

                                        <input
                                            type="radio" className="btn-check" name="currency" id="curKhr"
                                            checked={currency === "KHR"} onChange={() => setCurrency("KHR")}
                                        />
                                        <label className="btn btn-outline-dark px-4" htmlFor="curKhr">KHR (៛)</label>
                                    </div>

                                    <button
                                        className="btn btn-dark w-100 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                        onClick={handleCreateQr}
                                        disabled={loadingQr}
                                    >
                                        {loadingQr ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Creating QR...
                                            </>
                                        ) : (
                                            <>
                                                <QrIcon size={20} />
                                                {currency === "USD" ? "Pay with ABA QR (USD)" : "Pay with ABA QR (KHR)"}
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-muted small mt-2 mb-0">
                                        The QR code is valid for 5 minutes. Your order is placed after the payment arrives.
                                    </p>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className="d-inline-block bg-white border rounded-4 p-3 mb-3">
                                        <QRCodeSVG value={qrData.qr} size={220} />
                                    </div>

                                    <h4 className="fw-bold mb-1">
                                        {qrData.currency === "USD"
                                            ? `$${Number(qrData.amount).toFixed(2)}`
                                            : `${Number(qrData.amount).toLocaleString()} ៛`}
                                    </h4>
                                    <p className="text-muted small mb-3">
                                        Open ABA Mobile, tap Scan, and pay this amount.
                                    </p>

                                    <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                                        <span className="spinner-border spinner-border-sm text-secondary"></span>
                                        <span className="text-muted small">
                                            Waiting for payment · expires in {formatTime(secondsLeft)}
                                        </span>
                                    </div>

                                    <button
                                        className="btn btn-dark border rounded-pill px-4"
                                        onClick={() => setQrData(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <Link to="/cart" className="btn btn-dark border rounded-3 px-4 mt-3">
                        ← Back to cart
                    </Link>
                </div>

                {/* ===== RIGHT SIDE: ORDER SUMMARY ===== */}
                <div className="col-lg-4">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-3">Order summary</h5>

                        {items.map((item) => (
                            <div key={item.cart_item_id} className="d-flex align-items-center gap-3 mb-3">
                                <div className="position-relative">
                                    <img
                                        src={`${API_BASE}/uploads/${item.image}`}
                                        alt={item.name}
                                        className="rounded-3 border"
                                        style={{ width: "52px", height: "52px", objectFit: "cover" }}
                                    />
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                                        {item.quantity}
                                    </span>
                                </div>
                                <span className="small flex-grow-1">{item.name}</span>
                                <span className="small fw-semibold">${item.subtotal}</span>
                            </div>
                        ))}

                        <hr />

                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Subtotal</span>
                            <span>${Number(subtotal).toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Delivery</span>
                            <span className={deliveryFee === 0 ? "text-success" : ""}>
                                {deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}
                            </span>
                        </div>
                        {deliveryFee > 0 && (
                            <p className="text-muted small mb-2">Free delivery on orders over $50.</p>
                        )}

                        <hr />

                        <div className="d-flex justify-content-between">
                            <span className="fw-bold fs-5">Total</span>
                            <span className="fw-bold fs-5">${finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Checkout;