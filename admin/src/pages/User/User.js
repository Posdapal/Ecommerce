// import React from "react";
// import { useEffect, useState } from "react";
// import { Card, Table } from 'react-bootstrap';
// import axios from "axios";
// import { FaEdit, FaTrash } from 'react-icons/fa';

// const API_BASE = "http://localhost:8081";

// const User = () => {

//   const [list, setList] = useState([]);

//   const [users, setUsers] = useState({
//     username: "",
//     email: "",
//     phone: "",
//   });

//   const [updateusers, setUpdateusers] = useState({
//     user_id: "",
//     username: "",
//     email: "",
//     phone: "",
//   })

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUsers({ ...users, [name]: value });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setUpdateusers({ ...updateusers, [name]: value });
//   }

//   const handleEditClick = (item) => {
//     setUpdateusers(item);
//   }

//   useEffect(() => {
//     getListUsers();
//     getListUsersbyId();
//   }, [])

//   // getAll
//   const getListUsers = () => {
//     axios({
//       url: `${API_BASE}/api/user`,
//       method: "get",
//     }).then(res => {
//       console.log(res.data)
//       setList(res.data.list)
//     }).catch(error => {
//       console.log(error)
//     })
//   }

//    const getListUsersbyId = () => {
//     axios({
//       url: `${API_BASE}/api/user/${updateusers.user_id}`,
//       method: "get",
//     }).then(res => {
//       setList(res.data.list)
//     }).catch(error => {
//       console.log(error)
//     })
//   }

//   return (
//     <div>
//       <div className="d-lg-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
//         <div className="mb-4 mb-lg-0">
//           <h4 class='font-weight-bold'>User List</h4>
//           <p className="mb-0">Your user list on dashboard page</p>
//         </div>
//       </div>

//       <Card border="light" className="table-wrapper table-responsive shadow-sm">
//         <Card.Body>
//           <Table hover className="user-table align-items-center">
//             <thead>
//               <tr>
//                 <th className="border-bottom">No.</th>
//                 <th className="border-bottom">Username</th>
//                 <th className="border-bottom">Email</th>
//                 <th className="border-bottom">Phone</th>
//               </tr>
//             </thead>
//             <tbody>
//               {list.map((item, index) => (
//                 <tr key={item.user_id}>
//                   <th className='cell'>{index + 1}</th>
//                   <td className='cell'>{item.username}</td>
//                   <td className='cell'>{item.email}</td>
//                   <td className='cell'>{item.phone}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>


//     </div>
//   )
// }

// export default User;


import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

// Requires bootstrap + bootstrap-icons (see Navbar.jsx header comment):
//   import "bootstrap/dist/css/bootstrap.min.css";
//   import "bootstrap-icons/font/bootstrap-icons.css";
//   import "bootstrap/dist/js/bootstrap.bundle.min.js";

const API_BASE = "http://localhost:8081";

// helper: initials for the avatar circle, e.g. "Jane Doe" -> "JD"
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1
    ? parts[0][0] + parts[parts.length - 1][0]
    : parts[0].slice(0, 2);
  return initials.toUpperCase();
};

const User = () => {

  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const q = search.toLowerCase();

  const showUsername = filterBy === "all" || filterBy === "username";
  const showEmail = filterBy === "all" || filterBy === "email"
  const showPhone = filterBy === "all" || filterBy === "phone";

  const columnCount = 1 + [showUsername, showEmail, showPhone].filter(Boolean).length;

  const filteredList = list.filter((item) => {
    const username = (item.username || "").toLowerCase();
    const email = (item.email || "").toLowerCase();
    const phone = (item.phone || "").toLowerCase();

    if (filterBy === "username") return username.includes(q);
    if (filterBy === "email") return email.includes(q);
    if (filterBy === "phone") return phone.includes(q);

    // "all"
    return username.includes(q) || email.includes(q) || phone.includes(q);
  });

  // pagination
  const totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = filteredList.slice(start, start + pageSize);


  const [users, setUsers] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const [updateusers, setUpdateusers] = useState({
    user_id: "",
    username: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsers({ ...users, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdateusers({ ...updateusers, [name]: value });
  };

  const handleEditClick = (item) => {
    setUpdateusers(item);
  };

  useEffect(() => {
    getListUsers();
    // getListUsersbyId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // getAll
  const getListUsers = () => {
    axios({
      url: `${API_BASE}/api/user`,
      method: "get",
    }).then(res => {
      console.log(res.data);
      setList(res.data.list);
    }).catch(error => {
      console.log(error);
    });
  };

  const getListUsersbyId = () => {
    axios({
      url: `${API_BASE}/api/user/${updateusers.user_id}`,
      method: "get",
    }).then(res => {
      setList(res.data.list);
    }).catch(error => {
      console.log(error);
    });
  };

  // const filteredList = list.filter((item) => {
  //   const q = search.toLowerCase();
  //   return (
  //     item.username?.toLowerCase().includes(q) ||
  //     item.email?.toLowerCase().includes(q) ||
  //     item.phone?.toLowerCase().includes(q)
  //   );
  // });

  return (
    <div>
      {/* Page header */}
      <div className="d-lg-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-3">
        <div className="mb-3 mb-lg-0">
          <h4 className="fw-bold mb-1">Customers</h4>
          <p className="text-secondary mb-0">Everyone who has an account in your store</p>
        </div>
        {/* <div style={{ maxWidth: "280px", width: "100%" }}>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-search text-secondary"></i>
            </span>
            <input
              type="search"
              className="form-control bg-light border-start-0"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div> */}

        <div className="d-flex gap-2" style={{ maxWidth: "420px", width: "100%" }}>
          <select
            className="form-select w-auto"
            value={filterBy}
            onChange={(e) => { setFilterBy(e.target.value); setPage(1); }}
          >
            <option value="all">All</option>
            <option value="username">Username</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>

          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-search text-secondary"></i>
            </span>
            <input
              type="search"
              className="form-control bg-light border-start-0"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* Customer table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">


          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">No.</th>
                  {/* <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th> */}
                  {showUsername && <th>Customer</th>}
                  {showEmail && <th>Email</th>}
                  {showPhone && <th>Phone</th>}
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-secondary py-5">
                      <i className="bi bi-people fs-2 d-block mb-2"></i>
                      {list.length === 0 ? "No customers yet." : "No customers match your search."}
                    </td>
                  </tr>
                )}
                {pageItems.map((item, index) => (
                  <tr key={item.user_id}>
                    <td className="ps-3">{index + 1}</td>
                    {/* <td>
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary fw-semibold"
                          style={{ width: "36px", height: "36px", fontSize: "0.8rem" }}
                        >
                          {getInitials(item.username)}
                        </span>
                        <span className="fw-medium">{item.username}</span>
                      </div>
                    </td>
                    <td className="text-secondary">{item.email}</td>
                    <td className="text-secondary">{item.phone}</td> */}

                    {showUsername && (
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary fw-semibold"
                            style={{ width: "36px", height: "36px", fontSize: "0.8rem" }}
                          >
                            {getInitials(item.username)}
                          </span>
                          <span className="fw-medium">{item.username}</span>
                        </div>
                      </td>
                    )}

                    {showEmail && <td className="text-secondary">{item.email}</td>}
                    {showPhone && <td className="text-secondary">{item.phone}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-3 border-top">

            {/* rows per page */}
            <div className="d-flex align-items-center gap-2">
              <span className="small text-secondary">Rows per page</span>
              <select
                className="form-select form-select-sm w-auto"
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </div>

            {/* info text */}
            <span className="small text-secondary">
              {filteredList.length === 0
                ? "0 results"
                : `${start + 1}-${Math.min(start + pageSize, filteredList.length)} of ${filteredList.length}`}
            </span>

            {/* page buttons */}
            <ul className="pagination pagination-sm mb-0">
              <li className={"page-item" + (page === 1 ? " disabled" : "")}>
                <button className="page-link" onClick={() => setPage(page - 1)}>Prev</button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <li key={n} className={"page-item" + (page === n ? " active" : "")}>
                  <button className="page-link" onClick={() => setPage(n)}>{n}</button>
                </li>
              ))}

              <li className={"page-item" + (page === totalPages ? " disabled" : "")}>
                <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default User;