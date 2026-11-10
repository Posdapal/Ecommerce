// import { NavLink } from "react-router-dom";
// import React from "react";
// import "./Sidebar.css";


// function Sidebar({ sidebarOpen }) {
//   return (
//     <section id="sidebar" className={sidebarOpen ? "" : "hide"}>
//       <a href="#" className="brand">
//         <i className="bx bxs-devices"></i>
//         <span className="text">Electronic Store</span>
//       </a>

//       <ul className="side-menu top">
//         <li>
//           <NavLink to="/dashboard">
//             <i className="bx bxs-dashboard"></i>
//             <span>Dashboard</span>
//           </NavLink>
//         </li>

//         <li>
//           <NavLink to="/products">
//             <i className="bx bxs-box"></i>
//             <span>Product</span>
//           </NavLink>
//         </li>

//         <li>
//           <NavLink to="/categories">
//             <i className="bx bxs-category"></i>
//             <span>Category</span>
//           </NavLink>
//         </li>

//         <li>
//           <NavLink to="/users">
//             <i className="bx bxs-user"></i>
//             <span>User</span>
//           </NavLink>
//         </li>

//         <li>
//           <NavLink to="/orders">
//             <i className="bx bxs-receipt"></i>
//             <span>Order</span>
//           </NavLink>
//         </li>

//         <li>
//           <NavLink to="/logout">
//             <i className="bx bx-log-out-circle"></i>
//             <span>Logout</span>
//           </NavLink>
//         </li>
//       </ul>
//     </section>
//   );
// }

// export default Sidebar;

import React from "react";
import { NavLink } from "react-router-dom";

// Requires bootstrap + bootstrap-icons (see Navbar.jsx header comment).

const navItems = [
  { to: "/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
  { to: "/products", icon: "bi-box-seam", label: "Products" },
  { to: "/categories", icon: "bi-tags", label: "Categories" },
  { to: "/users", icon: "bi-people", label: "Users" },
  { to: "/orders", icon: "bi-receipt", label: "Orders" },
];

function NavItems() {
  return (
    <ul className="nav nav-pills flex-column gap-1 px-2">
      {navItems.map((item) => (
        <li className="nav-item" key={item.to}>
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              "nav-link d-flex align-items-center gap-2 rounded-3 " +
              (isActive ? "active" : "text-body")
            }
          >
            <i className={`bi ${item.icon} fs-5`}></i>
            <span>{item.label}</span>
          </NavLink>
        </li>
      ))}

      <li>
        <hr className="text-secondary-subtle my-2" />
      </li>

      <li className="nav-item">
        <NavLink to="/logout" className="nav-link d-flex align-items-center gap-2 rounded-3 text-danger">
          <i className="bi bi-box-arrow-right fs-5"></i>
          <span>Logout</span>
        </NavLink>
      </li>
    </ul>
  );
}

function Sidebar({ sidebarOpen, toggleSidebar }) {
  return (
    <>
      {/* Desktop / tablet sidebar: collapses to an icon rail when closed */}
      <aside
        id="sidebar"
        className={
          "d-none d-lg-flex flex-column bg-body-tertiary border-end vh-100 sticky-top " +
          (sidebarOpen ? "" : "sidebar-collapsed")
        }
        style={{
          width: sidebarOpen ? "250px" : "72px",
          transition: "width .2s ease",
          overflowX: "hidden",
        }}
      >
        <a
          href="#/dashboard"
          className="d-flex align-items-center gap-2 text-decoration-none px-3 py-3 border-bottom"
        >
          <i className="bi bi-shop fs-3 text-primary"></i>
          {sidebarOpen && (
            <span className="fw-bold fs-5 text-body">ShopAdmin</span>
          )}
        </a>

        <div className="flex-grow-1 overflow-auto py-3">
          {sidebarOpen ? (
            <NavItems />
          ) : (
            // icon-only rail: reuse the same items, labels hidden visually
            <ul className="nav nav-pills flex-column gap-1 px-2 align-items-center">
              {navItems.map((item) => (
                <li className="nav-item" key={item.to}>
                  <NavLink
                    to={item.to}
                    title={item.label}
                    className={({ isActive }) =>
                      "nav-link d-flex justify-content-center " +
                      (isActive ? "active" : "text-body")
                    }
                  >
                    <i className={`bi ${item.icon} fs-5`}></i>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Mobile: offcanvas drawer, toggled by the navbar's menu button */}
      <div
        className={"offcanvas offcanvas-start bg-body-tertiary d-lg-none " + (sidebarOpen ? "show" : "")}
        tabIndex="-1"
        style={{ visibility: sidebarOpen ? "visible" : "hidden", width: "250px" }}
      >
        <div className="offcanvas-header border-bottom">
          <a href="#/dashboard" className="d-flex align-items-center gap-2 text-decoration-none">
            <i className="bi bi-shop fs-3 text-primary"></i>
            <span className="fw-bold fs-5 text-body">ShopAdmin</span>
          </a>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={toggleSidebar}
          ></button>
        </div>
        <div className="offcanvas-body p-0 py-3">
          <NavItems />
        </div>
      </div>

      {/* Backdrop for mobile offcanvas */}
      {sidebarOpen && (
        <div
          className="offcanvas-backdrop fade show d-lg-none"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}

export default Sidebar;