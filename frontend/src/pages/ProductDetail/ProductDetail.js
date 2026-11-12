import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_BASE =  process.env.REACT_APP_API_URL;

function ProductDetail() {
    const { product_id } = useParams();            // the number from the url: /product/5
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });   // type: "success" or "danger"

    // ---------- load ONE product ----------
    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            setQuantity(1);
            try {
                const res = await axios.get(`${API_BASE}/api/product/${product_id}`);
                setProduct(res.data.list[0] || null);   // getOne sends { list: [ product ] }
            } catch (error) {
                console.log(error);
                setProduct(null);
            }
            setLoading(false);
        };
        loadProduct();
    }, [product_id]);

    // ---------- add to cart (returns true when it worked) ----------
    const addToCart = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage({ type: "danger", text: "Please login first." });
            return false;
        }
        setAdding(true);
        setMessage({ type: "", text: "" });
        try {
            await axios.post(
                `${API_BASE}/api/cart/add`,
                { product_id: product.product_id, quantity },
                { headers: { Authorization: token } }
            );
            window.dispatchEvent(new Event("cartUpdated"));   // update the number on the header
            setAdding(false);
            return true;
        } catch (error) {
            setMessage({ type: "danger", text: "Could not add to cart." });
            setAdding(false);
            return false;
        }
    };

    const handleAddToCart = async () => {
        const ok = await addToCart();
        if (ok) setMessage({ type: "success", text: "Added to your cart." });
    };

    // "Buy now" = add to cart, then go straight to the cart page
    const handleBuyNow = async () => {
        const ok = await addToCart();
        if (ok) navigate("/checkout");
    };

    /* ===== LOADING ===== */
    if (loading) {
        return (
            <div className="text-center" style={{ marginTop: "120px" }}>
                <div className="spinner-border"></div>
            </div>
        );
    }

    /* ===== NOT FOUND ===== */
    if (!product) {
        return (
            <div className="container text-center" style={{ marginTop: "120px" }}>
                <h4 className="fw-bold">Product not found</h4>
                <Link to="/" className="btn btn-dark rounded-pill px-4 mt-2">Back to shop</Link>
            </div>
        );
    }

    // discount (only when the product has an old_price)
    const hasDiscount = product.old_price && Number(product.old_price) > Number(product.price);
    const discount = hasDiscount
        ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
        : 0;

    return (
        <div className="container" style={{ marginTop: "40px", marginBottom: "60px" }}>

            {/* ===== BREADCRUMB: Home / Product name ===== */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb small">
                    <li className="breadcrumb-item"><Link to="/" className="link-dark">Home</Link></li>
                    <li className="breadcrumb-item active text-truncate" style={{ maxWidth: "220px" }}>{product.name}</li>
                </ol>
            </nav>

            <div className="row g-4 g-lg-5">

                {/* ===== LEFT: IMAGE (medium size) ===== */}
                <div className="col-md-6 col-lg-5">
                    {/* maxWidth keeps the image from getting too big on large screens */}
                    <div className="mx-auto" style={{ maxWidth: "480px" }}>
                        <div className="ratio ratio-1x1 bg-white border rounded-4 overflow-hidden shadow-sm">
                            {product.image ? (
                                <img
                                    src={`${API_BASE}/uploads/${product.image}`}
                                    alt={product.name}
                                    className="object-fit-contain w-100 h-100 p-3"
                                />
                            ) : (
                                <div className="d-flex align-items-center justify-content-center text-body-secondary">
                                    No image
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ===== RIGHT: INFORMATION ===== */}
                <div className="col-md-6 col-lg-7">

                    <h1 className="h2 fw-bold mb-3">{product.name}</h1>

                    {/* price */}
                    <div className="d-flex align-items-baseline flex-wrap gap-2 mb-3">
                        <span className="display-6 fw-bold">${product.price}</span>
                        {hasDiscount && (
                            <>
                                <span className="text-body-secondary text-decoration-line-through">${product.old_price}</span>
                                <span className="badge text-bg-danger rounded-pill">-{discount}%</span>
                            </>
                        )}
                    </div>

                    <hr />

                    {/* quantity */}
                    <label className="small fw-semibold text-uppercase text-body-secondary mb-2 d-block">Quantity</label>
                    <div className="input-group mb-4" style={{ width: "150px" }}>
                        <button
                            className="btn btn-outline-dark"
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            −
                        </button>
                        <span className="form-control text-center fw-semibold">{quantity}</span>
                        <button
                            className="btn btn-outline-dark"
                            type="button"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            +
                        </button>
                    </div>

                    {/* buttons: on phones they are full width, on bigger screens side by side */}
                    <div className="row g-2 mb-3">
                        <div className="col-sm-6">
                            <button
                                className="btn btn-dark btn-lg w-100 rounded-3 fw-semibold"
                                onClick={handleAddToCart}
                                disabled={adding}
                            >
                                {adding ? <span className="spinner-border spinner-border-sm"></span> : "Add to cart"}
                            </button>
                        </div>
                        <div className="col-sm-6">
                            <button
                                className="btn btn-outline-dark btn-lg w-100 rounded-3 fw-semibold"
                                onClick={handleBuyNow}
                                disabled={adding}
                            >
                                Buy now
                            </button>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`alert alert-${message.type} py-2 d-flex justify-content-between align-items-center`}>
                            <span>{message.text}</span>
                            {message.type === "success" && (
                                <Link to="/cart" className="alert-link">View cart</Link>
                            )}
                        </div>
                    )}

                    {/* shop promises */}
                    <ul className="list-unstyled small text-body-secondary border rounded-3 p-3 mt-4 mb-0">
                        <li className="mb-1">✓ Free delivery on orders over $50</li>
                        <li className="mb-1">✓ Pay with ABA QR or cash on delivery</li>
                        <li>✓ Easy checkout, no extra fees</li>
                    </ul>
                </div>
            </div>

            {/* ===== DESCRIPTION (full width, under the product) ===== */}
            <div className="card border-0 shadow-sm rounded-4 mt-5">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">Product description</h5>
                    {/* "pre-line" keeps the line breaks the admin typed */}
                    <p className="mb-0" style={{ whiteSpace: "pre-line" }}>
                        {product.description || "No description yet."}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;