// import { useState } from "react";
// import React from "react";
// import axios from "axios";
// import { useNavigate } from 'react-router-dom';

// function RegisterLogin({ setToken }) {

//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [message] = useState("");
//   const navigate = useNavigate();

//   const showMessage = (type, message) => {
//     if (type === 'error') {
//       setErrorMessage(message);
//       setTimeout(() => setErrorMessage(''), 3000);
//     } else {
//       setSuccessMessage(message);
//       setTimeout(() => setSuccessMessage(''), 3000);
//     }
//   }

//   const handleRegister = (event) => {
//     event.preventDefault();
//     axios.post('http://localhost:8081/api/admin/register',
//       {
//         username,
//         email,
//         password
//       }
//     ).then((response) => {

//       // Clear form after success
//       setUsername("");
//       setEmail("");
//       setPassword("");

//       // show message
//       showMessage('success', 'Registration successfull! Please login.');

//     }).catch((error) => {
//       if (error.response) {
//         showMessage(error.response.data.message);
//       } else {
//         showMessage("Server Error")
//       }
//     });
//   };

//   const handleLogin = async (event) => {
//     event.preventDefault();

//     try {

//         const response = await axios.post(
//             "http://localhost:8081/api/admin/login",
//             {
//                 email,
//                 password
//             }
//         );

//         // console.log(response.data);

//         localStorage.setItem("token", response.data.token);

//         navigate("/dashboard", {
//             replace: true
//         });

//     } catch (error) {

//         console.log(error);

//     }
// };

//   const renderAlert = () => {
//     if (successMessage) {
//       return (
//         <div className="alert alert-success alert-dismissible fade show d-flex align-items-center shadow-sm" role="alert">
//           <i className="bi bi-check-circle-fill me-2"></i>
//           <div>{successMessage}</div>
//           <button
//             type="button"
//             className="btn-close"
//             onClick={() => setSuccessMessage('')}
//             aria-label="Close"
//           ></button>
//         </div>
//       );
//     }
//     if (errorMessage) {
//       return (
//         <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center shadow-sm" role="alert">
//           <i className="bi bi-exclamation-triangle-fill me-2"></i>
//           <div>{errorMessage}</div>
//           <button
//             type="button"
//             className="btn-close"
//             onClick={() => setErrorMessage('')}
//             aria-label="Close"
//           ></button>
//         </div>
//       );
//     }
//     return null;
//   };


//   return (
//     <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">

//       <div className="card p-4 shadow-lg" style={{ width: "380px", borderRadius: "15px" }}>

//         {isLogin ? (
//           <>
//             <h3 className="text-center mb-3">LOGIN</h3>

//             {renderAlert()}

//             <form>
//               <div className="mb-3">
//                 <label className="form-label">Email</label>
//                 <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(event) => setEmail(event.target.value)} />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Password</label>
//                 <input type="password" className="form-control" placeholder="Enter password" value={password} onChange={(event) => setPassword(event.target.value)} />
//               </div>

//               <button type="submit" className="btn btn-dark w-100" onClick={handleLogin}>SIGN IN</button>
//             </form>

//             <p className="text-center mt-3">
//               Don't have an account?{" "}
//               <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); }}>
//                 Sign Up
//               </a>
//             </p>
//           </>
//         ) : (
//           <>
//             <h3 className="text-center mb-3">REGISTER</h3>

//             {renderAlert()}

//             <form>
//               <div className="mb-3">
//                 <label className="form-label">Username</label>
//                 <input type="text" className="form-control" placeholder="Enter username" value={username} onChange={(event) => setUsername(event.target.value)} />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Email</label>
//                 <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(event) => setEmail(event.target.value)} />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Password</label>
//                 <input type="password" className="form-control" placeholder="Enter password" value={password} onChange={(event) => setPassword(event.target.value)} />
//               </div>

//               <button type="submit" className="btn btn-dark w-100" onClick={handleRegister}>REGISTER</button>
//               <p>{message}</p>
//             </form>

//             <p className="text-center mt-3">
//               Already have an account?{" "}
//               <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); }}>
//                 Login
//               </a>
//             </p>
//           </>
//         )}

//       </div>
//     </div>
//   );
// }

// export default RegisterLogin;

import { useState } from "react";
import React from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

// Requires bootstrap + bootstrap-icons (see Navbar.jsx header comment):
//   import "bootstrap/dist/css/bootstrap.min.css";
//   import "bootstrap-icons/font/bootstrap-icons.css";
//   import "bootstrap/dist/js/bootstrap.bundle.min.js";

const API_BASE = process.env.REACT_APP_API_URL;

function RegisterLogin({ setToken }) {

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!isLogin && username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!isLogin && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true = no errors
  };

  const showMessage = (type, message) => {
    if (type === 'error') {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), 3000);
    } else {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const switchMode = (loginMode) => {
    setIsLogin(loginMode);
    setErrorMessage('');
    setSuccessMessage('');
    setErrors({});             // 👈 add this
  };

  const handleRegister = (event) => {
    event.preventDefault();
    if (!validate()) return;   // 👈 add this
    setIsSubmitting(true);

    axios.post(`${API_BASE}/api/admin/register`,
      {
        username,
        email,
        password
      }
    ).then(() => {

      // Clear form after success
      setUsername("");
      setEmail("");
      setPassword("");

      // show message
      showMessage('success', 'Registration successful! Please login.');
      setIsLogin(true);

    }).catch((error) => {
      if (error.response) {
        showMessage('error', error.response.data.message);
      } else {
        showMessage('error', "Server Error");
      }
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!validate()) return;   // 👈 add this
    setIsSubmitting(true);

    try {

      const response = await axios.post(
        `${API_BASE}/api/admin/login`,
        {
          email,
          password
        }
      );

      localStorage.setItem("token", response.data.token);
      if (setToken) setToken(response.data.token);

      navigate("/dashboard", {
        replace: true
      });

    } catch (error) {

      if (error.response) {
        showMessage('error', error.response.data.message || "Invalid email or password");
      } else {
        showMessage('error', "Server Error");
      }

    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAlert = () => {
    if (successMessage) {
      return (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center shadow-sm py-2" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          <div className="small">{successMessage}</div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage('')}
            aria-label="Close"
          ></button>
        </div>
      );
    }
    if (errorMessage) {
      return (
        <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center shadow-sm py-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div className="small">{errorMessage}</div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setErrorMessage('')}
            aria-label="Close"
          ></button>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 bg-primary bg-white px-3"
    >
      <div className="card border-0 shadow-lg p-4 p-md-5" style={{ width: "450px", borderRadius: "1rem" }}>

        {/* Brand */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle mb-2"
            style={{ width: "56px", height: "56px" }}
          >
            <i className="bi bi-shop fs-3 text-primary"></i>
          </div>
          <h4 className="fw-bold mb-0">ShopAdmin</h4>
          <p className="text-secondary small mb-0">Manage your store in one place</p>
        </div>

        {/* Login / Register switch */}
        <div className="btn-group w-100 mb-4" role="group" aria-label="Login or register">
          <button
            type="button"
            className={"btn " + (isLogin ? "btn-primary" : "btn-outline-secondary")}
            onClick={() => switchMode(true)}
          >
            Login
          </button>
          <button
            type="button"
            className={"btn " + (!isLogin ? "btn-primary" : "btn-outline-secondary")}
            onClick={() => switchMode(false)}
          >
            Register
          </button>
        </div>

        {renderAlert()}

        {isLogin ? (
          <form onSubmit={handleLogin} noValidate>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                <input
                  type="email"
                  className={"form-control" + (errors.email ? " is-invalid" : "")}
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
                <input
                  type={showPassword ? "text" : "password"}
                  className={"form-control" + (errors.password ? " is-invalid" : "")}
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-person"></i></span>
                <input
                  type="text"
                  className={"form-control" + (errors.username ? " is-invalid" : "")}
                  placeholder="Your name"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                <input
                  type="email"
                  className={"form-control" + (errors.email ? " is-invalid" : "")}
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
                <input
                  type={showPassword ? "text" : "password"}
                  className={"form-control" + (errors.password ? " is-invalid" : "")}
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
               {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

export default RegisterLogin;