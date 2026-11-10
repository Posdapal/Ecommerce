import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import AuthModal from "./Authentication/AuthModal";
import ProductCard from "./components/ProductCard/ProductCard";
import Checkout from "./pages/Checkout/Checkout";
import OrderDone from "./pages/OrderDone/OrderDone";
import ProductDetail from "./pages/ProductDetail/ProductDetail";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/authmodal" element={<AuthModal />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orderdone" element={<OrderDone/>}/>
          <Route path="/productcard" element={<ProductCard/>} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:product_id" element={<ProductDetail />} />
       </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
