import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Category from "./pages/Category/Category";
import User from "./pages/User/User";
import Order from "./pages/Order/Order";
import Product from "./pages/Product/Product";

import RegisterLogin from "./Authentication/RegisterLogin/RegisterLogin";
import Layout from "./Layout/Layout"
import Logout from "./pages/Logout/Logout";
import AdminProtectedRoute from "./Protected/AdminProtectedRoute";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterLogin />} />
        
        <Route element={<AdminProtectedRoute />}>
          <Route element={<Layout />}>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/users" element={<User />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/products" element={<Product />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;