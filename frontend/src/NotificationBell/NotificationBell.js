import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

// the page that lists all orders of the customer (change it if your route is different)
const ORDERS_PATH = "/orders";

// sentence + colour for each order status
const STATUS_INFO = {
    Pending: { text: "was placed", color: "secondary" },
    Processing: { text: "is being prepared", color: "warning" },
    Shipped: { text: "is on the way", color: "info" },
    Delivered: { text: "was delivered", color: "success" },
    Cancelled: { text: "was cancelled", color: "danger" },
};
const getInfo = (status) =>
    STATUS_INFO[status] || { text: `is ${String(status || "updated").toLowerCase()}`, color: "secondary" };

// The browser remembers which status of each order the customer has already seen.
// Example: { "12": "Shipped", "13": "Pending" }
// One memory per username, so two people on the same computer do not mix.
const getStorageKey = () => `seenOrders_${localStorage.getItem("username") || "user"}`;

const readSeen = () => {
    try {
        return JSON.parse(localStorage.getItem(getStorageKey()));   // null if nothing saved yet
    } catch (error) {
        return null;
    }
};

const makeSeenMap = (orders) => {
    const map = {};
    orders.forEach((o) => { map[o.order_id] = o.order_status; });
    return map;
};

function NotificationBell({ token }) {
    const [orders, setOrders] = useState([]);
    const [open, setOpen] = useState(false);
    const [seen, setSeen] = useState(readSeen);   // null = first time on this browser
    const [newIds, setNewIds] = useState([]);     // the orders to highlight while the list is open

    // ---------- load the orders: when the page opens, every minute, and after a new order ----------
    useEffect(() => {
        const loadOrders = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/myorders`, {
                    headers: { Authorization: token },
                });
                const list = Array.isArray(res.data) ? res.data : (res.data.list || []);
                const newest = [...list].sort((a, b) => b.order_id - a.order_id);
                setOrders(newest);

                // very first time: do NOT make a notification for every old order
                if (localStorage.getItem(getStorageKey()) === null) {
                    const map = makeSeenMap(newest);
                    localStorage.setItem(getStorageKey(), JSON.stringify(map));
                    setSeen(map);
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadOrders();
        const timer = setInterval(loadOrders, 60000);              // check again every 60 seconds
        window.addEventListener("cartUpdated", loadOrders);        // a new order was just placed
        return () => {
            clearInterval(timer);
            window.removeEventListener("cartUpdated", loadOrders);
        };
    }, [token]);

    // ---------- which orders are new? (never seen, or the status changed) ----------
    const unread = seen ? orders.filter((o) => seen[o.order_id] !== o.order_status) : [];

    const handleToggle = () => {
        if (!open) {
            setNewIds(unread.map((o) => o.order_id));   // remember them, to highlight them in the list
            const map = makeSeenMap(orders);            // then mark everything as seen
            localStorage.setItem(getStorageKey(), JSON.stringify(map));
            setSeen(map);
        }
        setOpen(!open);
    };

    const latestOrders = orders.slice(0, 5);   // show the 5 newest orders

    return (
        <div className="position-relative me-3">

            {/* ===== BELL BUTTON + red number ===== */}
            <button
                type="button"
                aria-label="Notifications"
                className="btn btn-light rounded-circle p-2 border position-relative"
                style={{ width: "40px", height: "40px" }}
                onClick={handleToggle}
            >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                </svg>

                {unread.length > 0 && (
                    <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: "10px" }}
                    >
                        {unread.length}
                    </span>
                )}
            </button>

            {/* ===== THE LIST ===== */}
            {open && (
                <>
                    {/* invisible layer: a click outside closes the list */}
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100"
                        style={{ zIndex: 1040 }}
                        onClick={() => setOpen(false)}
                    ></div>

                    <div
                        className="position-absolute end-0 bg-white shadow rounded-3 mt-2 overflow-hidden"
                        style={{ top: "100%", width: "min(340px, calc(100vw - 110px))", zIndex: 1050 }}
                    >
                        <div className="px-3 py-2 border-bottom fw-semibold">Notifications</div>

                        {latestOrders.length === 0 ? (
                            <div className="text-center text-muted small py-4">No orders yet.</div>
                        ) : (
                            latestOrders.map((order) => {
                                const info = getInfo(order.order_status);
                                const isNew = newIds.includes(order.order_id);
                                return (
                                    <Link
                                        key={order.order_id}
                                        to={ORDERS_PATH}
                                        onClick={() => setOpen(false)}
                                        className={`d-flex gap-3 px-3 py-3 border-bottom text-decoration-none text-body ${isNew ? "bg-body-tertiary" : ""}`}
                                    >
                                        {/* coloured dot */}
                                        <span
                                            className={`rounded-circle bg-${info.color} flex-shrink-0 mt-1`}
                                            style={{ width: "10px", height: "10px" }}
                                        ></span>

                                        <span className="flex-grow-1">
                                            <span className={`d-block small ${isNew ? "fw-bold" : ""}`}>
                                                Order #{order.order_id} {info.text}
                                            </span>
                                            <span className="d-block text-muted" style={{ fontSize: "12px" }}>
                                                ${Number(order.final_total || 0).toFixed(2)}
                                                {order.created_at && ` · ${new Date(order.created_at).toLocaleDateString()}`}
                                            </span>
                                        </span>

                                        {isNew && <span className="badge text-bg-danger align-self-start">New</span>}
                                    </Link>
                                );
                            })
                        )}

                        <Link
                            to={ORDERS_PATH}
                            onClick={() => setOpen(false)}
                            className="d-block text-center small fw-semibold py-2 text-decoration-none"
                        >
                            View all orders
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default NotificationBell;