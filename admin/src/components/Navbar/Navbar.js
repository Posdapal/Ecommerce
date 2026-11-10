// import React from "react";
// import "./Navbar.css";
// import imageperson from "../../assets/images/images.jpg"

// function Navbar({ toggleSidebar }) {
//   return (
//     <nav>
//       <i className="bx bx-menu" onClick={toggleSidebar}></i>


//       <form>
//         <div className="form-input">
//           <input type="search" placeholder="Search..." />
//           <button type="button">
//             <i className="bx bx-search"></i>
//           </button>
//         </div>
//       </form>

//       <a href="#" className="notification">
//         <i className="bx bxs-bell"></i>
//         <span className="num">8</span>
//       </a>

//       <a href="#" className="profile">
//         <img src={imageperson} alt="profile" />
//       </a>
//     </nav>
//   );
// }

// export default Navbar;

import React from "react";
import { useTheme } from "../../context/ThemeContext";

// Requires: bootstrap (JS bundle) + bootstrap-icons installed and imported once
// in your app entry, e.g. in index.js / App.js:
//   import "bootstrap/dist/css/bootstrap.min.css";
//   import "bootstrap-icons/font/bootstrap-icons.css";
//   import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Navbar({ toggleSidebar }) {
  const { theme, toggleTheme } = useTheme();

  return (
    // bg-body-tertiary + border-bottom are theme-aware — they'll flip to a dark
    // surface automatically once data-bs-theme="dark" is set. bg-white would not.
    <nav className="navbar bg-body-tertiary border-bottom sticky-top px-3 py-2">
      <div className="container-fluid px-0">
        {/* Left: sidebar toggle + search */}
        <div className="d-flex align-items-center gap-3 flex-grow-1">
          <button
            className="btn btn-outline-secondary border-0"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <i className="bi bi-list fs-4"></i>
          </button>

          <form
            className="d-none d-md-flex"
            style={{ maxWidth: "360px", width: "100%" }}
            role="search"
          >
            <div className="input-group">
              <span className="input-group-text bg-body-secondary border-end-0">
                <i className="bi bi-search text-secondary"></i>
              </span>
              <input
                type="search"
                className="form-control bg-body-secondary border-start-0"
                placeholder="Search products, orders, customers..."
              />
            </div>
          </form>
        </div>

        {/* Right: cart shortcut, dark mode toggle, profile */}
        <div className="d-flex align-items-center gap-2">
          {/* Orders / cart shortcut */}
          <a
            href="#/orders"
            className="btn btn-outline-secondary border-0 position-relative"
            title="Orders"
          >
            <i className="bi bi-cart3 fs-5"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
              12
              <span className="visually-hidden">pending orders</span>
            </span>
          </a>

          {/* Dark mode toggle */}
          <button
            className="btn btn-outline-secondary border-0"
            type="button"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <i className={`bi ${theme === "dark" ? "bi-sun" : "bi-moon-stars"} fs-5`}></i>
          </button>

          {/* Profile dropdown */}
          <div className="dropdown">
            <button
              className="btn d-flex align-items-center gap-2 border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span
                className="rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center"
                style={{ width: "36px", height: "36px" }}
              >
                <i className="bi bi-person-fill text-secondary fs-5"></i>
              </span>
              <span className="d-none d-md-inline small fw-medium">Admin</span>
              <i className="bi bi-chevron-down small d-none d-md-inline"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
              <li>
                <h6 className="dropdown-header">Signed in as Admin</h6>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item text-danger" href="/logout">
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

