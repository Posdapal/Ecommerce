// import React, { useState } from 'react'
// import { Link } from "react-router-dom"
// import axios from "axios"

// const API_BASE = "http://localhost:8081";
// const UPLOADS_BASE = `${API_BASE}/uploads/`;

// const getImageUrl = (filename) => {
//   if (!filename) return null;
//   if (filename.startsWith("http") || filename.startsWith("blob:")) return filename;
//   return `${UPLOADS_BASE}${filename}`;
// }

// function ProductCard({ product }) {
//   const [liked, setLiked] = useState(false);

//   const handleAddtoCart = async () => {
//     const token = localStorage.getItem("token");

//     // if (!token) {
//     //   alert("Please login first");
//     //   return;
//     // }

//     try {
//       await axios.post(`${API_BASE}/api/cart/add`,
//         { product_id: product.product_id, quantity: 1 },
//         {
//           headers: { Authorization: token }
//         }
//       );
//       // tell Header to refresh the cart number
//       window.dispatchEvent(new Event("cartUpdated"));
//     } catch (error) {
//       console.log(error);
//       alert("Failed to add to cart");
//     }
//   };

//     return (
//       <div className="col-6 col-md-3 mb-4">
//         <div className="card h-100 border-0 shadow-sm position-relative">

//           {/* WISHLIST heart */}
//           <button
//             className="btn btn-light rounded-circle p-1 position-absolute top-0 end-0 m-2 z-1 border-0"
//             style={{ width: "30px", height: "30px" }}
//             onClick={() => setLiked(!liked)}
//           >
//             <svg
//               width="16"
//               height="16"
//               fill={liked ? "#dc3545" : "none"}
//               stroke={liked ? "#dc3545" : "currentColor"}
//               strokeWidth="1.5"
//               viewBox="0 0 16 16"
//             >
//               <path d="M8 14.25c-3.5-2.3-7-5-7-8.4A3.6 3.6 0 0 1 4.6 2.25 3.9 3.9 0 0 1 8 4.1a3.9 3.9 0 0 1 3.4-1.85A3.6 3.6 0 0 1 15 5.85c0 3.4-3.5 6.1-7 8.4Z" />
//             </svg>
//           </button>

//           {/* IMAGE */}
//           <Link to={`/product/${product.product_id}`}>
//             <img
//               src={getImageUrl(product.image)}
//               alt={product.name}
//               className="w-100"
//               style={{ height: "220px", objectFit: "cover" }}
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.style.display = "none";
//               }}
//             />
//           </Link>

//           {/* DETAILS */}
//           <div className="card-body px-2 pt-2 pb-3">
//             <p className="mb-1 small text-truncate" title={product.name}>
//               {product.name}
//             </p>
//             <p className="fw-semibold mb-2">${product.price}</p>

//             <button onClick={handleAddtoCart}
//               className="btn btn-outline-dark btn-sm w-100 rounded-1 d-flex align-items-center justify-content-center gap-2">
//               <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
//                 <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.49.402H4a.5.5 0 0 1-.49-.402L2.01 2.5H.5a.5.5 0 0 1-.5-.5Zm3.14 3 .84 4h7.11l.8-4H3.14ZM4 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-7-1a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
//               </svg>
//               Add to Cart
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

// export default ProductCard

import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { showToast } from "./Toast ";


const API_BASE = process.env.REACT_APP_API_URL;
const UPLOADS_BASE = `${API_BASE}/uploads/`;

const getImageUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith("http") || filename.startsWith("blob:")) return filename;
  return `${UPLOADS_BASE}${filename}`;
};

function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);
  const [adding, setAdding] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const imageUrl = getImageUrl(product.image);
  const hasDiscount = product.old_price && product.old_price > product.price;
  const discount = hasDiscount
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    // not logged in -> friendly message, no requst
    if (!token) {
      showToast("warning", "Please login to add items to your cart.");
      return;
    }
    setAdding(true);
    try {
      await axios.post(
        `${API_BASE}/api/cart/add`,
        { product_id: product.product_id, quantity: 1 },
        { headers: { Authorization: token } }
      );
      window.dispatchEvent(new Event("cartUpdated"));
      showToast("success", `${product.name} was added to your cart.`);
    } catch (error) {
      if (error.response?.status === 401) {
        showToast("warning", "Your login has expired. Please login again.");
      } else {
        showToast("danger", "We could not add this item. Please try again.");
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="col-6 col-md-4 col-lg-3 mb-4">
      {/* .card is already position-relative, so stretched-link covers the whole card */}
      <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">

        {/* IMAGE */}
        <div className="ratio ratio-1x1 bg-body-tertiary">
          {imageUrl && !imgFailed ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="object-fit-cover w-100 h-100"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center text-body-secondary small">
              No image
            </div>
          )}
        </div>

        {/* BADGES (top-left) */}
        <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1">
          {product.is_new && (
            <span className="badge text-bg-dark rounded-pill">New</span>
          )}
          {hasDiscount && (
            <span className="badge text-bg-danger rounded-pill">-{discount}%</span>
          )}
        </div>

        {/* WISHLIST (top-right) */}
        <button
          type="button"
          aria-label="Add to wishlist"
          className="btn btn-light rounded-circle shadow-sm border-0 p-2 lh-1 position-absolute top-0 end-0 m-2 z-2"
          onClick={() => setLiked(!liked)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill={liked ? "#dc3545" : "none"}
            stroke={liked ? "#dc3545" : "currentColor"}
            strokeWidth="1.5"
          >
            <path d="M8 14.25c-3.5-2.3-7-5-7-8.4A3.6 3.6 0 0 1 4.6 2.25 3.9 3.9 0 0 1 8 4.1a3.9 3.9 0 0 1 3.4-1.85A3.6 3.6 0 0 1 15 5.85c0 3.4-3.5 6.1-7 8.4Z" />
          </svg>
        </button>

        {/* DETAILS */}
        <div className="card-body p-3">
          {product.category && (
            <div className="text-uppercase text-body-secondary small mb-1">
              {product.category}
            </div>
          )}

          <Link
            to={`/product/${product.product_id}`}
            className="link-dark text-decoration-none fw-medium d-block text-truncate stretched-link"
            title={product.name}
          >
            {product.name}
          </Link>

          {product.rating > 0 && (
            <div className="small text-warning mt-1">
              {"★".repeat(Math.round(product.rating))}
              <span className="text-body-tertiary">
                {"★".repeat(5 - Math.round(product.rating))}
              </span>
            </div>
          )}
        </div>

        {/* FOOTER: price left, icon-only cart button right */}
        <div className="card-footer bg-transparent border-0 pt-0 px-3 pb-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-baseline gap-2">
            <span className="fs-5 fw-bold">${product.price}</span>
            {hasDiscount && (
              <span className="small text-body-secondary text-decoration-line-through">
                ${product.old_price}
              </span>
            )}
          </div>

          <button
            type="button"
            aria-label="Add to cart"
            title="Add to cart"
            onClick={handleAddToCart}
            disabled={adding}
            className="btn btn-dark rounded-circle p-2 lh-1 position-relative z-2"
          >
            {adding ? (
              <span className="spinner-border spinner-border-sm d-block" />
            ) : (
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;