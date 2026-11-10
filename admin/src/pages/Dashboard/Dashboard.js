import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Chart,
  BarController, BarElement,
  CategoryScale, LinearScale,
  Tooltip,
} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const API_BASE = "http://localhost:8081";

// 12.5 -> "$12.50"
const money = (n) => `$${Number(n).toFixed(2)}`;

// "Sophie Martin" -> "SM"
const getInitials = (name) =>
  String(name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

// colours for the round avatars and the chart bars
const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

// nice name for the payment_method saved in the database
const methodLabel = (method) => {
  if (method === "CASH") return "Cash on delivery";
  if (method === "ABA_QR_USD") return "ABA QR (USD)";
  if (method === "ABA_QR_KHR") return "ABA QR (KHR)";
  return method;
};

// badge for the payment status
const statusBadge = (status) => {
  if (status === "PAID") return { text: "Paid", cls: "bg-success bg-opacity-10 text-success" };
  if (status === "PENDING") return { text: "Pending", cls: "bg-warning bg-opacity-10 text-warning" };
  return { text: status || "-", cls: "bg-secondary bg-opacity-10 text-secondary" };
};

export default function Dashboard() {
  const token = localStorage.getItem("token");

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [data, setData] = useState(null);   // everything from the backend
  const [error, setError] = useState("");

  // ---------- 1) get the numbers and lists from the backend ----------
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/dashboard/summary`, {
          headers: { Authorization: token },
        });
        setData(res.data);
      } catch (err) {
        console.log(err);

        if (!err.response) {
          setError("Cannot reach the backend. Is the server running on port 8081?");
        } else if (err.response.status === 401) {
          setError("Your login has expired. Please log out and log in again.");
        } else if (err.response.status === 404) {
          setError("Dashboard route not found (404). Check that /api/dashboard/summary is registered in index.js.");
        } else {
          setError(`Could not load the dashboard (error ${err.response.status}).`);
        }
      }
    };

    loadDashboard();
  }, [token]);

  // ---------- 2) draw the chart after the data arrives ----------
  useEffect(() => {
    if (!data || !data.top_products || data.top_products.length === 0 || !chartRef.current) return;

    chartInstance.current = new Chart(chartRef.current.getContext("2d"), {
      type: "bar",
      data: {
        labels: data.top_products.map((p) => p.name),
        datasets: [
          {
            label: "Ordered",
            data: data.top_products.map((p) => p.total_ordered),
            backgroundColor: COLORS,
            borderRadius: 6,
          },
        ],
      },
      options: {
        indexAxis: "y",              // bars go from left to right
        responsive: true,
        maintainAspectRatio: false,  // the box around the canvas sets the height
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1e293b", titleColor: "#e2e8f0", bodyColor: "#cbd5e1", padding: 12, cornerRadius: 10,
            callbacks: { label: (c) => ` ${c.parsed.x} ordered` },
          },
        },
        scales: {
          x: { beginAtZero: true, grid: { color: "#f1f5f9" }, ticks: { color: "#94a3b8", precision: 0 } },
          y: { grid: { display: false }, ticks: { color: "#475569" } },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [data]);

  /* ===== ERROR ===== */
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  /* ===== LOADING ===== */
  if (!data) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="text-muted mt-3 mb-0">Loading dashboard...</p>
      </div>
    );
  }

  // ---------- the cards (numbers come from the backend) ----------
  const statCards = [
    { label: "Category", value: data.total_categories, sub: "In total", icon: "bi-grid", color: "primary" },
    { label: "Products", value: data.total_products, sub: "In your shop", icon: "bi-box-seam", color: "success" },
    { label: "Users", value: data.total_users, sub: "Registered accounts", icon: "bi-people", color: "warning" },
    { label: "Orders", value: data.total_orders, sub: "All time", icon: "bi-cart3", color: "danger" },
    { label: "Revenue", value: money(data.total_revenue), sub: "Paid orders", icon: "bi-cash-coin", color: "success" },
    { label: "Cash to collect", value: money(data.pending_cash), sub: "Cash on delivery", icon: "bi-hourglass-split", color: "info" },
  ];

  const recentOrders = data.recent_orders || [];
  const topUsers = data.top_users || [];
  const topProducts = data.top_products || [];

  return (
    <div>
      {/* ── Stat Cards ── */}
      <div className="row g-3 mb-4">
        {statCards.map(({ label, value, sub, icon, color }) => (
          <div key={label} className="col-12 col-sm-6 col-xl-4">
            <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
              <div className={`bg-${color}`} style={{ height: 3 }}></div>
              <div className="card-body d-flex align-items-start justify-content-between">
                <div>
                  <p className="text-uppercase fw-semibold text-muted mb-1" style={{ fontSize: ".7rem", letterSpacing: ".06em" }}>{label}</p>
                  <h3 className="fw-bold mb-1" style={{ fontSize: "1.8rem" }}>{value}</h3>
                  <p className="text-muted mb-0" style={{ fontSize: ".72rem" }}>{sub}</p>
                </div>
                <div className={`rounded-3 bg-${color} bg-opacity-10 text-${color} d-flex align-items-center justify-content-center`}
                  style={{ width: 48, height: 48, fontSize: "1.4rem", flexShrink: 0 }}>
                  <i className={`bi ${icon}`}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tables Row ── */}
      <div className="row g-3 mb-4">

        {/* Recent Orders */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between py-3 px-4">
              <h6 className="mb-0 fw-bold"><i className="bi bi-receipt text-primary me-2"></i>Recent Orders</h6>
              <a href="#" className="btn btn-outline-primary btn-sm rounded-2" style={{ fontSize: ".72rem" }}>View All</a>
            </div>
            <div className="card-body p-0">
              {recentOrders.length === 0 ? (
                <p className="text-muted text-center py-5 mb-0">No orders yet</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        {["Order ID", "Customer", "Payment", "Amount", "Status"].map((h) => (
                          <th key={h} className="text-uppercase text-muted fw-semibold px-4" style={{ fontSize: ".68rem", letterSpacing: ".07em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: ".82rem" }}>
                      {recentOrders.map((order) => {
                        const badge = statusBadge(order.payment_status);
                        return (
                          <tr key={order.order_id}>
                            <td className="px-4 fw-semibold text-primary" style={{ fontSize: ".8rem" }}>#{order.order_id}</td>
                            <td>{order.username}</td>
                            <td>{methodLabel(order.payment_method)}</td>
                            <td><strong>{money(order.final_total)}</strong></td>
                            <td><span className={`badge fw-semibold rounded-pill px-3 ${badge.cls}`}>{badge.text}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Users */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between py-3 px-4">
              <h6 className="mb-0 fw-bold"><i className="bi bi-people text-warning me-2"></i>Top Users</h6>
              <a href="#" className="btn btn-outline-warning btn-sm rounded-2" style={{ fontSize: ".72rem" }}>View All</a>
            </div>
            <div className="card-body p-0">
              {topUsers.length === 0 ? (
                <p className="text-muted text-center py-5 mb-0">No users yet</p>
              ) : (
                topUsers.map((user, i) => (
                  <div key={user.user_id} className={`d-flex align-items-center gap-3 px-4 py-3 ${i < topUsers.length - 1 ? "border-bottom" : ""}`}>
                    <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                      style={{ width: 38, height: 38, background: COLORS[i % COLORS.length], fontSize: ".85rem" }}>
                      {getInitials(user.username)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold" style={{ fontSize: ".83rem" }}>{user.username}</div>
                      <div className="text-muted" style={{ fontSize: ".72rem" }}>{user.email}</div>
                    </div>
                    <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold rounded-pill px-3" style={{ fontSize: ".72rem" }}>
                      {user.order_count} {user.order_count === 1 ? "order" : "orders"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="row g-3">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white border-bottom py-3 px-4">
              <h6 className="mb-0 fw-bold"><i className="bi bi-graph-up-arrow text-success me-2"></i>Most Ordered Products</h6>
            </div>
            <div className="card-body">
              {topProducts.length === 0 ? (
                <p className="text-muted text-center py-5 mb-0">No products ordered yet</p>
              ) : (
                <div style={{ width: "100%", maxWidth: "1200px", height: 300, margin: "0 auto" }}>
                  <canvas ref={chartRef}></canvas>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}