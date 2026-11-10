import React from 'react';
import { Link } from 'react-router-dom';

// Shown after the order is saved.
// "order" is the data the backend sent back (order_id, subtotal, delivery_fee, final_total, payment_method)
function OrderDone({ order }) {
    const isCash = order.payment_method === "CASH";

    return (
        <div className="container" style={{ marginTop: "100px", marginBottom: "60px", maxWidth: "560px" }}>
            <div className="card border-0 shadow-sm rounded-4 text-center">
                <div className="card-body p-5">
                    <div
                        className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{ width: "64px", height: "64px" }}
                    >
                        <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                        </svg>
                    </div>

                    <h4 className="fw-bold">
                        {isCash ? "Order placed" : "Payment received"}
                    </h4>
                    <p className="text-muted mb-4">
                        Your order #{order.order_id} is confirmed.
                        {isCash &&
                            ` Please pay $${Number(order.final_total).toFixed(2)} in cash when it arrives.`}
                    </p>

                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Subtotal</span>
                        <span>${Number(order.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Delivery</span>
                        <span>{order.delivery_fee === 0 ? "Free" : `$${order.delivery_fee}`}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-4">
                        <span className="fw-bold">Total</span>
                        <span className="fw-bold">${Number(order.final_total).toFixed(2)}</span>
                    </div>

                    <Link to="/" className="btn btn-dark rounded-pill px-4">
                        Continue shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default OrderDone;