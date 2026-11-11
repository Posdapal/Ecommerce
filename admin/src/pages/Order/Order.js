// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const API_BASE = "http://localhost:8081";

// export default function Order() {
//   const token = localStorage.getItem("token");
//   const headers = { Authorization: token };

//   // data from the API
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // search / filter / sort / page
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchField, setSearchField] = useState("all");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [filterPayment, setFilterPayment] = useState("");
//   const [sortBy, setSortBy] = useState("order_id");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   // modal
//   const [showModal, setShowModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [loadingDetail, setLoadingDetail] = useState(false);

//   // ---------- load all orders ----------
//   const loadOrders = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.get(`${API_BASE}/api/orders`, { headers });
//       setOrders(res.data.list);
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not load orders");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, searchField, filterStatus, filterPayment, sortBy]);

//   // ---------- open one order ----------
//   const handleViewOrder = async (order_id) => {
//     setShowModal(true);
//     setLoadingDetail(true);
//     setSelectedOrder(null);
//     setSelectedItems([]);
//     try {
//       const res = await axios.get(`${API_BASE}/api/orders/${order_id}`, { headers });
//       setSelectedOrder(res.data.order);
//       setSelectedItems(res.data.items);
//     } catch (err) {
//       setError("Could not load the order details");
//       setShowModal(false);
//     }
//     setLoadingDetail(false);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedOrder(null);
//     setSelectedItems([]);
//   };

//   // ---------- helpers ----------
//   const uniqueStatuses = [...new Set(orders.map((o) => o.order_status))];
//   const uniquePayments = [...new Set(orders.map((o) => o.payment_method))];

//   const paymentLabel = (method) => {
//     if (method === "ABA_QR_USD") return "ABA QR (USD)";
//     if (method === "ABA_QR_KHR") return "ABA QR (KHR)";
//     if (method === "CASH") return "Cash on delivery";
//     return method;
//   };

//   const statusBadge = (status) => {
//     switch (status) {
//       case "Delivered": return "text-bg-success";
//       case "Shipped": return "text-bg-info";
//       case "Processing": return "text-bg-warning";
//       case "Cancelled": return "text-bg-danger";
//       default: return "text-bg-secondary"; // Pending
//     }
//   };

//   const countByStatus = (status) =>
//     orders.filter((o) => o.order_status === status).length;

//   // ---------- filter ----------
//   const search = searchTerm.toLowerCase();

//   let filteredOrders = orders.filter((order) => {
//     let searchMatch = true;

//     if (search) {
//       const id = String(order.order_id);
//       const user = String(order.user_id);
//       const address = String(order.address_id);

//       if (searchField === "order_id") searchMatch = id.includes(search);
//       else if (searchField === "user_id") searchMatch = user.includes(search);
//       else if (searchField === "address_id") searchMatch = address.includes(search);
//       else
//         searchMatch =
//           id.includes(search) ||
//           user.includes(search) ||
//           address.includes(search) ||
//           paymentLabel(order.payment_method).toLowerCase().includes(search) ||
//           String(order.order_status).toLowerCase().includes(search);
//     }

//     const statusMatch = filterStatus === "" || order.order_status === filterStatus;
//     const paymentMatch = filterPayment === "" || order.payment_method === filterPayment;

//     return searchMatch && statusMatch && paymentMatch;
//   });

//   // ---------- sort ----------
//   filteredOrders = [...filteredOrders].sort((a, b) => {
//     if (sortBy === "final_total") return Number(b.final_total) - Number(a.final_total);
//     return b.order_id - a.order_id;
//   });

//   // ---------- pagination ----------
//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

//   const totalFinal = filteredOrders.reduce((sum, o) => sum + Number(o.final_total), 0);

//   /* ===== NOT LOGGED IN ===== */
//   if (!token) {
//     return (
//       <div className="container text-center py-5">
//         <h4 className="fw-bold">Please login first</h4>
//       </div>
//     );
//   }

//   /* ===== LOADING ===== */
//   if (loading) {
//     return (
//       <div className="container text-center py-5">
//         <div className="spinner-border text-dark"></div>
//         <p className="text-muted mt-3">Loading orders...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-vh-100 bg-body-tertiary">
//       {/* ===== HEADER ===== */}
//       <div className="bg-dark text-white py-4 mb-4">
//         <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">
//           <div>
//             <h2 className="fw-bold mb-0">Orders</h2>
//             <span className="text-white-50">Manage and track every customer order</span>
//           </div>
//           <button className="btn btn-warning fw-semibold px-4" onClick={loadOrders}>
//             Refresh
//           </button>
//         </div>
//       </div>

//       <div className="container pb-5">
//         {error && (
//           <div className="alert alert-danger d-flex justify-content-between align-items-center">
//             <span>{error}</span>
//             <button className="btn btn-sm btn-outline-danger" onClick={loadOrders}>
//               Try again
//             </button>
//           </div>
//         )}

//         {/* ===== STAT CARDS ===== */}
//         <div className="row g-3 mb-4">
//           <div className="col-6 col-lg-3">
//             <div className="card border-0 border-start border-4 border-primary shadow-sm h-100">
//               <div className="card-body">
//                 <div className="text-muted small text-uppercase fw-semibold">Total orders</div>
//                 <div className="fs-2 fw-bold">{orders.length}</div>
//               </div>
//             </div>
//           </div>
//           <div className="col-6 col-lg-3">
//             <div className="card border-0 border-start border-4 border-success shadow-sm h-100">
//               <div className="card-body">
//                 <div className="text-muted small text-uppercase fw-semibold">Found</div>
//                 <div className="fs-2 fw-bold">{filteredOrders.length}</div>
//               </div>
//             </div>
//           </div>
//           <div className="col-6 col-lg-3">
//             <div className="card border-0 border-start border-4 border-warning shadow-sm h-100">
//               <div className="card-body">
//                 <div className="text-muted small text-uppercase fw-semibold">Total amount</div>
//                 <div className="fs-2 fw-bold">${totalFinal.toFixed(2)}</div>
//               </div>
//             </div>
//           </div>
//           <div className="col-6 col-lg-3">
//             <div className="card border-0 border-start border-4 border-info shadow-sm h-100">
//               <div className="card-body">
//                 <div className="text-muted small text-uppercase fw-semibold">Page</div>
//                 <div className="fs-2 fw-bold">{currentPage} / {totalPages || 1}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ===== TABLE CARD ===== */}
//         <div className="card border-0 shadow-sm">
//           {/* status tabs */}
//           <div className="card-header bg-white border-0 pt-3">
//             <ul className="nav nav-pills gap-2 flex-wrap">
//               <li className="nav-item">
//                 <button
//                   className={`nav-link rounded-pill ${filterStatus === "" ? "active bg-dark" : "text-dark bg-body-secondary"}`}
//                   onClick={() => setFilterStatus("")}
//                 >
//                   All <span className="badge text-bg-light ms-1">{orders.length}</span>
//                 </button>
//               </li>
//               {uniqueStatuses.map((s) => (
//                 <li className="nav-item" key={s}>
//                   <button
//                     className={`nav-link rounded-pill ${filterStatus === s ? "active bg-dark" : "text-dark bg-body-secondary"}`}
//                     onClick={() => setFilterStatus(s)}
//                   >
//                     {s} <span className="badge text-bg-light ms-1">{countByStatus(s)}</span>
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* toolbar */}
//           <div className="card-body border-bottom">
//             <div className="row g-2">
//               <div className="col-lg-4">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Search orders..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <div className="col-6 col-lg-2">
//                 <select
//                   className="form-select"
//                   value={searchField}
//                   onChange={(e) => setSearchField(e.target.value)}
//                 >
//                   <option value="all">All fields</option>
//                   <option value="order_id">Order ID</option>
//                   <option value="user_id">User ID</option>
//                   <option value="address_id">Address ID</option>
//                 </select>
//               </div>
//               <div className="col-6 col-lg-3">
//                 <select
//                   className="form-select"
//                   value={filterPayment}
//                   onChange={(e) => setFilterPayment(e.target.value)}
//                 >
//                   <option value="">All payments</option>
//                   {uniquePayments.map((m) => (
//                     <option key={m} value={m}>{paymentLabel(m)}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="col-12 col-lg-3">
//                 <select
//                   className="form-select"
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                 >
//                   <option value="order_id">Sort: Latest first</option>
//                   <option value="final_total">Sort: Highest amount</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* table */}
//           {paginatedOrders.length > 0 ? (
//             <div className="table-responsive">
//               <table className="table table-striped table-hover align-middle mb-0">
//                 <thead className="table-dark">
//                   <tr>
//                     <th>Order</th>
//                     <th>User</th>
//                     <th>Address</th>
//                     <th className="text-end">Subtotal</th>
//                     <th className="text-end">Delivery</th>
//                     <th className="text-end">Total</th>
//                     <th>Payment</th>
//                     <th>Status</th>
//                     <th className="text-end">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedOrders.map((order) => (
//                     <tr key={order.order_id}>
//                       <td className="fw-bold">#{order.order_id}</td>
//                       <td>User {order.user_id}</td>
//                       <td className="text-muted">#{order.address_id}</td>
//                       <td className="text-end">${Number(order.subtotal).toFixed(2)}</td>
//                       <td className="text-end text-muted">
//                         ${Number(order.delivery_fee).toFixed(2)}
//                       </td>
//                       <td className="text-end fw-bold">
//                         ${Number(order.final_total).toFixed(2)}
//                       </td>
//                       <td>
//                         <div className="small fw-medium">{paymentLabel(order.payment_method)}</div>
//                         {order.payment_status && (
//                           <span
//                             className={`badge rounded-pill ${
//                               order.payment_status === "PAID"
//                                 ? "text-bg-success"
//                                 : "text-bg-secondary"
//                             }`}
//                           >
//                             {order.payment_status}
//                           </span>
//                         )}
//                       </td>
//                       <td>
//                         <span className={`badge rounded-pill ${statusBadge(order.order_status)}`}>
//                           {order.order_status}
//                         </span>
//                       </td>
//                       <td className="text-end">
//                         <button
//                           className="btn btn-sm btn-dark rounded-pill px-3"
//                           onClick={() => handleViewOrder(order.order_id)}
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-center py-5">
//               <h5 className="text-secondary">No orders found</h5>
//               <p className="text-muted mb-0">Try changing your search or filters</p>
//             </div>
//           )}

//           {/* footer: items per page + pagination */}
//           {paginatedOrders.length > 0 && (
//             <div className="card-footer bg-white border-0 py-3">
//               <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
//                 <div className="d-flex align-items-center gap-2">
//                   <span className="text-muted small">Rows per page</span>
//                   <select
//                     className="form-select form-select-sm w-auto"
//                     value={itemsPerPage}
//                     onChange={(e) => {
//                       setItemsPerPage(Number(e.target.value));
//                       setCurrentPage(1);
//                     }}
//                   >
//                     <option value={5}>5</option>
//                     <option value={10}>10</option>
//                     <option value={15}>15</option>
//                     <option value={20}>20</option>
//                   </select>
//                   <span className="text-muted small">
//                     Showing {startIndex + 1}-{startIndex + paginatedOrders.length} of {filteredOrders.length}
//                   </span>
//                 </div>

//                 <ul className="pagination pagination-sm mb-0">
//                   <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//                     <button
//                       className="page-link"
//                       onClick={() => setCurrentPage(currentPage - 1)}
//                       disabled={currentPage === 1}
//                     >
//                       &laquo;
//                     </button>
//                   </li>

//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
//                     <li key={num} className={`page-item ${num === currentPage ? "active" : ""}`}>
//                       <button className="page-link" onClick={() => setCurrentPage(num)}>
//                         {num}
//                       </button>
//                     </li>
//                   ))}

//                   <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
//                     <button
//                       className="page-link"
//                       onClick={() => setCurrentPage(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                     >
//                       &raquo;
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ===== ORDER DETAILS MODAL ===== */}
//       {showModal && (
//         <>
//           <div className="modal fade show d-block" tabIndex="-1">
//             <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
//               <div className="modal-content border-0 shadow-lg rounded-4">
//                 <div className="modal-header bg-dark text-white border-0">
//                   <h5 className="modal-title fw-bold">
//                     {selectedOrder ? `Order #${selectedOrder.order_id}` : "Order details"}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close btn-close-white"
//                     onClick={handleCloseModal}
//                   ></button>
//                 </div>

//                 <div className="modal-body p-4">
//                   {loadingDetail && (
//                     <div className="text-center py-4">
//                       <div className="spinner-border text-dark"></div>
//                     </div>
//                   )}

//                   {selectedOrder && (
//                     <>
//                       {/* info */}
//                       <div className="row g-3 mb-4">
//                         <div className="col-6 col-md-3">
//                           <div className="text-muted small">Status</div>
//                           <span className={`badge rounded-pill ${statusBadge(selectedOrder.order_status)}`}>
//                             {selectedOrder.order_status}
//                           </span>
//                         </div>
//                         <div className="col-6 col-md-3">
//                           <div className="text-muted small">User ID</div>
//                           <div className="fw-semibold">{selectedOrder.user_id}</div>
//                         </div>
//                         <div className="col-6 col-md-3">
//                           <div className="text-muted small">Address ID</div>
//                           <div className="fw-semibold">{selectedOrder.address_id}</div>
//                         </div>
//                         <div className="col-6 col-md-3">
//                           <div className="text-muted small">Payment</div>
//                           <div className="fw-semibold">{paymentLabel(selectedOrder.payment_method)}</div>
//                         </div>
//                       </div>

//                       {/* items */}
//                       <h6 className="fw-bold mb-2">Items</h6>
//                       <ul className="list-group list-group-flush border rounded-3 mb-4">
//                         {selectedItems.map((item) => (
//                           <li
//                             key={item.order_item_id || item.product_id}
//                             className="list-group-item d-flex align-items-center gap-3"
//                           >
//                             <img
//                               src={`${API_BASE}/uploads/${item.image}`}
//                               alt={item.name}
//                               className="rounded-3 border object-fit-cover"
//                               width="48"
//                               height="48"
//                             />
//                             <div className="flex-grow-1">
//                               <div className="fw-semibold">{item.name}</div>
//                               <div className="text-muted small">
//                                 {item.quantity} × ${Number(item.price).toFixed(2)}
//                               </div>
//                             </div>
//                             <strong>${(item.quantity * Number(item.price)).toFixed(2)}</strong>
//                           </li>
//                         ))}
//                       </ul>

//                       {/* pricing */}
//                       <div className="bg-body-tertiary rounded-3 p-3">
//                         <div className="d-flex justify-content-between mb-1">
//                           <span className="text-muted">Subtotal</span>
//                           <span>${Number(selectedOrder.subtotal).toFixed(2)}</span>
//                         </div>
//                         <div className="d-flex justify-content-between mb-2">
//                           <span className="text-muted">Delivery fee</span>
//                           <span>${Number(selectedOrder.delivery_fee).toFixed(2)}</span>
//                         </div>
//                         <hr className="my-2" />
//                         <div className="d-flex justify-content-between">
//                           <span className="fw-bold fs-5">Total</span>
//                           <span className="fw-bold fs-5">
//                             ${Number(selectedOrder.final_total).toFixed(2)}
//                           </span>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 <div className="modal-footer border-0">
//                   <button className="btn btn-dark rounded-pill px-4" onClick={handleCloseModal}>
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="modal-backdrop fade show"></div>
//         </>
//       )}
//     </div>
//   );
// }

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo
} from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

// 12.5 -> "$12.50"
const money = (n) => `$${Number(n).toFixed(2)}`;

// colours for the round avatars
const AVATAR_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

// "Sophie Martin" -> "SM"
const getInitials = (name) =>
  String(name || "?").split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

// the customer name (the backend sends username; if not, show the user id)
const customerName = (order) => order.username || `User ${order.user_id}`;

const orderDate = (order) =>
  order.created_at ? new Date(order.created_at).toLocaleDateString() : "";

const paymentLabel = (method) => {
  if (method === "ABA_QR_USD") return "ABA QR (USD)";
  if (method === "ABA_QR_KHR") return "ABA QR (KHR)";
  if (method === "CASH") return "Cash on delivery";
  return method;
};

// soft Bootstrap colours for the order status
const STATUS_STYLE = {
  Delivered: "bg-success-subtle text-success-emphasis",
  Shipped: "bg-info-subtle text-info-emphasis",
  Processing: "bg-warning-subtle text-warning-emphasis",
  Cancelled: "bg-danger-subtle text-danger-emphasis",
};
const statusBadge = (status) => STATUS_STYLE[status] || "bg-secondary-subtle text-secondary-emphasis";

// PAID -> "Paid", PENDING -> "Unpaid" (cash not collected yet)
const paymentBadge = (status) => {
  if (status === "PAID") return { text: "Paid", cls: "bg-success-subtle text-success-emphasis" };
  if (status === "PENDING") return { text: "Unpaid", cls: "bg-warning-subtle text-warning-emphasis" };
  return null;
};

// round avatar with the customer's initials
function Avatar({ order, size = 36 }) {
  return (
    <div
      className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.36, background: AVATAR_COLORS[order.user_id % AVATAR_COLORS.length] }}
    >
      {getInitials(customerName(order))}
    </div>
  );
}

export default function Order() {
  const token = localStorage.getItem("token");
  // const headers = { Authorization: token };
  const headers = useMemo(() => ({
    Authorization: token,
  }), [token]);

  // data from the API
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);       // first load
  const [refreshing, setRefreshing] = useState(false); // refresh button
  const [error, setError] = useState("");

  // search / filter / sort / page
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // order details (side panel)
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ---------- load all orders ----------
  // const loadOrders = async () => {
  //   setRefreshing(true);
  //   setError("");
  //   try {
  //     const res = await axios.get(`${API_BASE}/api/orders`, { headers });
  //     setOrders(res.data.list);
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Could not load orders");
  //   }
  //   setLoading(false);
  //   setRefreshing(false);
  // };

  const loadOrders = useCallback(async () => {
    setRefreshing(true);
    setError("");

    try {
      const res = await axios.get(`${API_BASE}/api/orders`, { headers });
      setOrders(res.data.list);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [headers]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // back to page 1 when a filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchField, filterStatus, filterPayment, sortBy, itemsPerPage]);

  // ---------- open one order ----------
  const handleViewOrder = async (order) => {
    setSelectedOrder(order);          // show what we already know right away
    setSelectedItems([]);
    setShowDrawer(true);
    setLoadingDetail(true);
    try {
      const res = await axios.get(`${API_BASE}/api/orders/${order.order_id}`, { headers });
      setSelectedOrder({ ...order, ...res.data.order });
      setSelectedItems(res.data.items);
    } catch (err) {
      setError("Could not load the order details");
      setShowDrawer(false);
    }
    setLoadingDetail(false);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setSelectedOrder(null);
    setSelectedItems([]);
  };

  // close the side panel with the Escape key
  useEffect(() => {
    if (!showDrawer) return;
    const onKey = (e) => {
      if (e.key === "Escape") handleCloseDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showDrawer]);

  // ---------- helpers ----------
  // the status tabs follow the life of an order: Pending -> Processing -> Shipped -> Delivered
  const STATUS_ORDER = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  const rank = (s) => (STATUS_ORDER.includes(s) ? STATUS_ORDER.indexOf(s) : STATUS_ORDER.length);
  const uniqueStatuses = [...new Set(orders.map((o) => o.order_status).filter(Boolean))].sort((a, b) => rank(a) - rank(b));
  const uniquePayments = [...new Set(orders.map((o) => o.payment_method).filter(Boolean))];

  const countByStatus = (status) => orders.filter((o) => o.order_status === status).length;

  // ---------- filter ----------
  const search = searchTerm.toLowerCase().replace("#", "");

  let filteredOrders = orders.filter((order) => {
    let searchMatch = true;

    if (search) {
      const id = String(order.order_id);
      const user = String(order.user_id);
      const address = String(order.address_id);

      if (searchField === "order_id") searchMatch = id.includes(search);
      else if (searchField === "user_id") searchMatch = user.includes(search);
      else if (searchField === "address_id") searchMatch = address.includes(search);
      else
        searchMatch =
          id.includes(search) ||
          user.includes(search) ||
          address.includes(search) ||
          customerName(order).toLowerCase().includes(search) ||
          paymentLabel(order.payment_method).toLowerCase().includes(search) ||
          String(order.order_status).toLowerCase().includes(search);
    }

    const statusMatch = filterStatus === "" || order.order_status === filterStatus;
    const paymentMatch = filterPayment === "" || order.payment_method === filterPayment;

    return searchMatch && statusMatch && paymentMatch;
  });

  // ---------- sort ----------
  filteredOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "oldest") return a.order_id - b.order_id;
    if (sortBy === "highest") return Number(b.final_total) - Number(a.final_total);
    if (sortBy === "lowest") return Number(a.final_total) - Number(b.final_total);
    return b.order_id - a.order_id; // latest
  });

  // ---------- pagination ----------
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // page buttons: 1 ... 4 5 6 ... 20
  const pageItems = [];
  for (let n = 1; n <= totalPages; n++) {
    if (n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1) pageItems.push(n);
    else if (pageItems[pageItems.length - 1] !== "...") pageItems.push("...");
  }

  // ---------- numbers for the cards ----------
  const needsAction = orders.filter((o) => o.order_status === "Pending" || o.order_status === "Processing").length;
  const hasPaymentStatus = orders.some((o) => o.payment_status);
  const activeOrders = orders.filter((o) => o.order_status !== "Cancelled");
  const sumOf = (list) => list.reduce((sum, o) => sum + Number(o.final_total), 0);

  const statCards = [
    { label: "Orders", value: orders.length, sub: "All time", color: "primary" },
    { label: "Needs action", value: needsAction, sub: "Pending or processing", color: "warning" },
    hasPaymentStatus
      ? { label: "Paid", value: money(sumOf(orders.filter((o) => o.payment_status === "PAID"))), sub: "Money received", color: "success" }
      : { label: "Total amount", value: money(sumOf(activeOrders)), sub: "Without cancelled orders", color: "success" },
    hasPaymentStatus
      ? { label: "To collect", value: money(sumOf(activeOrders.filter((o) => o.payment_status === "PENDING"))), sub: "Cash on delivery", color: "info" }
      : { label: "Cancelled", value: countByStatus("Cancelled"), sub: "Orders", color: "danger" },
  ];

  /* ===== NOT LOGGED IN ===== */
  if (!token) {
    return (
      <div className="text-center py-5">
        <h4 className="fw-bold">Please login first</h4>
      </div>
    );
  }

  /* ===== LOADING ===== */
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-dark"></div>
        <p className="text-muted mt-3 mb-0">Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      {/* ===== PAGE TITLE ===== */}
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Orders</h3>
          <p className="text-muted mb-0">Track every customer order, from payment to delivery.</p>
        </div>
        <button className="btn btn-outline-dark rounded-3 px-4" onClick={loadOrders} disabled={refreshing}>
          {refreshing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>Refreshing...
            </>
          ) : (
            "Refresh"
          )}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={loadOrders}>
            Try again
          </button>
        </div>
      )}

      {/* ===== STAT CARDS ===== */}
      <div className="row g-3 mb-4">
        {statCards.map(({ label, value, sub, color }) => (
          <div key={label} className="col-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 overflow-hidden h-100">
              <div className={`bg-${color}`} style={{ height: 3 }}></div>
              <div className="card-body">
                <p className="text-muted fw-semibold small mb-1">{label}</p>
                <h3 className="fw-bold mb-1">{value}</h3>
                <p className="text-muted mb-0 small">{sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== ORDERS CARD ===== */}
      <div className="card border-0 shadow-sm rounded-3">

        {/* status tabs */}
        <div className="card-header bg-white border-bottom px-4 pt-3 pb-0">
          <ul className="nav nav-underline flex-nowrap overflow-x-auto gap-4">
            <li className="nav-item">
              <button
                className={`nav-link px-0 pb-3 text-nowrap ${filterStatus === "" ? "active" : "text-secondary"}`}
                onClick={() => setFilterStatus("")}
              >
                All <span className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill ms-1">{orders.length}</span>
              </button>
            </li>
            {uniqueStatuses.map((s) => (
              <li className="nav-item" key={s}>
                <button
                  className={`nav-link px-0 pb-3 text-nowrap ${filterStatus === s ? "active" : "text-secondary"}`}
                  onClick={() => setFilterStatus(s)}
                >
                  {s} <span className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill ms-1">{countByStatus(s)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* search + filters */}
        <div className="card-body border-bottom p-3 p-md-4">
          <div className="row g-2">
            <div className="col-lg-5">
              <div className="input-group">
                <select
                  className="form-select flex-grow-0"
                  style={{ width: "auto" }}
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  aria-label="Search in"
                >
                  <option value="all">All fields</option>
                  <option value="order_id">Order ID</option>
                  <option value="user_id">User ID</option>
                  <option value="address_id">Address ID</option>
                </select>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search orders"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search orders"
                />
              </div>
            </div>
            <div className="col-6 col-lg-4">
              <select
                className="form-select"
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                aria-label="Payment method"
              >
                <option value="">All payment methods</option>
                {uniquePayments.map((m) => (
                  <option key={m} value={m}>{paymentLabel(m)}</option>
                ))}
              </select>
            </div>
            <div className="col-6 col-lg-3">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort by"
              >
                <option value="latest">Latest first</option>
                <option value="oldest">Oldest first</option>
                <option value="highest">Highest total</option>
                <option value="lowest">Lowest total</option>
              </select>
            </div>
          </div>
        </div>

        {/* table */}
        {paginatedOrders.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="text-muted small">
                  <th className="ps-3 ps-md-4 fw-semibold">Order</th>
                  <th className="fw-semibold d-none d-md-table-cell">Customer</th>
                  <th className="fw-semibold d-none d-lg-table-cell">Payment</th>
                  <th className="fw-semibold">Total</th>
                  <th className="fw-semibold">Status</th>
                  <th className="pe-3 pe-md-4"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => {
                  const pay = paymentBadge(order.payment_status);
                  return (
                    <tr key={order.order_id}>
                      {/* order number (+ customer name on small screens) */}
                      <td className="ps-3 ps-md-4">
                        <button
                          className="btn btn-link p-0 fw-bold text-decoration-none"
                          onClick={() => handleViewOrder(order)}
                        >
                          #{order.order_id}
                        </button>
                        {orderDate(order) && <div className="text-muted small d-none d-md-block">{orderDate(order)}</div>}
                        <div className="text-muted small d-md-none">{customerName(order)}</div>
                      </td>

                      {/* customer */}
                      <td className="d-none d-md-table-cell">
                        <div className="d-flex align-items-center gap-2">
                          <Avatar order={order} />
                          <div>
                            <div className="fw-semibold">{customerName(order)}</div>
                            <div className="text-muted small">Address #{order.address_id}</div>
                          </div>
                        </div>
                      </td>

                      {/* payment */}
                      <td className="d-none d-lg-table-cell">
                        <div className="small fw-medium">{paymentLabel(order.payment_method)}</div>
                        {pay && <span className={`badge rounded-pill ${pay.cls}`}>{pay.text}</span>}
                      </td>

                      {/* total */}
                      <td>
                        <div className="fw-bold">{money(order.final_total)}</div>
                        <div className="text-muted small d-lg-none">{paymentLabel(order.payment_method)}</div>
                        <div className="text-muted small d-none d-lg-block">
                          {money(order.subtotal)} + {money(order.delivery_fee)} delivery
                        </div>
                      </td>

                      {/* status */}
                      <td>
                        <span className={`badge rounded-pill ${statusBadge(order.order_status)}`}>
                          {order.order_status}
                        </span>
                      </td>

                      <td className="text-end pe-3 pe-md-4">
                        <button
                          className="btn btn-sm btn-outline-dark rounded-3 px-2 px-md-3"
                          onClick={() => handleViewOrder(order)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <h5 className="fw-bold">No orders found</h5>
            <p className="text-muted mb-0">Try a different search or filter.</p>
          </div>
        )}

        {/* footer: rows per page + pagination */}
        {paginatedOrders.length > 0 && (
          <div className="card-footer bg-white border-top-0 p-3 p-md-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <select
                  className="form-select form-select-sm w-auto"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  aria-label="Rows per page"
                >
                  <option value={5}>5 rows</option>
                  <option value={10}>10 rows</option>
                  <option value={20}>20 rows</option>
                  <option value={50}>50 rows</option>
                </select>
                <span className="text-muted small">
                  Showing {startIndex + 1}-{startIndex + paginatedOrders.length} of {filteredOrders.length}
                </span>
              </div>

              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                  </button>
                </li>

                {pageItems.map((item, i) =>
                  item === "..." ? (
                    <li key={`dots-${i}`} className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  ) : (
                    <li key={item} className={`page-item ${item === currentPage ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(item)}>
                        {item}
                      </button>
                    </li>
                  )
                )}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ===== ORDER DETAILS (side panel) ===== */}
      {showDrawer && selectedOrder && (
        <>
          <div
            className="offcanvas offcanvas-end show"
            style={{ width: "min(520px, 100vw)" }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="orderPanelTitle"
          >
            <div className="offcanvas-header border-bottom">
              <div>
                <h5 id="orderPanelTitle" className="offcanvas-title fw-bold mb-2">
                  Order #{selectedOrder.order_id}
                </h5>
                <div className="d-flex flex-wrap gap-2">
                  <span className={`badge rounded-pill ${statusBadge(selectedOrder.order_status)}`}>
                    {selectedOrder.order_status}
                  </span>
                  {paymentBadge(selectedOrder.payment_status) && (
                    <span className={`badge rounded-pill ${paymentBadge(selectedOrder.payment_status).cls}`}>
                      {paymentBadge(selectedOrder.payment_status).text}
                    </span>
                  )}
                </div>
              </div>
              <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDrawer}></button>
            </div>

            <div className="offcanvas-body">
              {/* customer */}
              <div className="d-flex align-items-center gap-3 mb-4">
                <Avatar order={selectedOrder} size={48} />
                <div>
                  <div className="fw-semibold">{customerName(selectedOrder)}</div>
                  <div className="text-muted small">
                    User ID {selectedOrder.user_id} · Address #{selectedOrder.address_id}
                  </div>
                </div>
              </div>

              {/* payment */}
              <div className="d-flex justify-content-between border rounded-3 p-3 mb-4">
                <span className="text-muted">Payment method</span>
                <span className="fw-semibold">{paymentLabel(selectedOrder.payment_method)}</span>
              </div>

              {/* items */}
              <h6 className="fw-bold mb-2">Items</h6>
              {loadingDetail ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-dark"></div>
                </div>
              ) : selectedItems.length === 0 ? (
                <p className="text-muted">No items found for this order.</p>
              ) : (
                <ul className="list-group list-group-flush border rounded-3 mb-4">
                  {selectedItems.map((item) => (
                    <li
                      key={item.order_item_id || item.product_id}
                      className="list-group-item d-flex align-items-center gap-3"
                    >
                      <div className="rounded-3 bg-body-secondary flex-shrink-0 overflow-hidden" style={{ width: 52, height: 52 }}>
                        <img
                          src={`${API_BASE}/uploads/${item.image}`}
                          alt={item.name}
                          className="w-100 h-100 object-fit-cover"
                          onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{item.name}</div>
                        <div className="text-muted small">
                          {item.quantity} × {money(item.price)}
                        </div>
                      </div>
                      <strong>{money(item.quantity * Number(item.price))}</strong>
                    </li>
                  ))}
                </ul>
              )}

              {/* totals */}
              <div className="bg-body-tertiary rounded-3 p-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Subtotal</span>
                  <span>{money(selectedOrder.subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Delivery fee</span>
                  <span>{Number(selectedOrder.delivery_fee) === 0 ? "Free" : money(selectedOrder.delivery_fee)}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between">
                  <span className="fw-bold fs-5">Total</span>
                  <span className="fw-bold fs-5">{money(selectedOrder.final_total)}</span>
                </div>
              </div>

              {selectedOrder.payment_method === "CASH" && selectedOrder.payment_status === "PENDING" && (
                <div className="alert alert-warning mt-3 mb-0 small">
                  Collect {money(selectedOrder.final_total)} in cash when the order is delivered.
                </div>
              )}
            </div>

            <div className="border-top p-3">
              <button className="btn btn-dark w-100 rounded-3" onClick={handleCloseDrawer}>
                Close
              </button>
            </div>
          </div>

          <div className="offcanvas-backdrop fade show" onClick={handleCloseDrawer}></div>
        </>
      )}
    </div>
  );
}