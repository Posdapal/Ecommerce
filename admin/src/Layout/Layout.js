// import { Outlet } from "react-router-dom";
// import { useState } from "react";
// import Navbar from "../components/Navbar/Navbar";
// import Sidebar from "../components/Sidebar/Sidebar";

// function Layout() {
//     const [sidebarOpen, setSidebarOpen] = useState(true);

//     return (
//         <div className="app">
//             <Sidebar sidebarOpen={sidebarOpen} />

//             <section id="content"
//                className={sidebarOpen ? "" : "content-expand"}
//             >
//                 <Navbar
//                     toggleSidebar={() =>
//                         setSidebarOpen((prev) => !prev)
//                     }
//                 />

//                 <main>
//                     <Outlet />
//                 </main>
//             </section>
//         </div>
//     )
// }

// export default Layout

import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    // bg-body-tertiary flips to a dark page background automatically in dark mode.
    <div className="d-flex min-vh-100 bg-body-tertiary">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="flex-grow-1 p-3 p-md-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;