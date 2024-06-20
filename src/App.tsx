import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Loader from "./common/Loader";
import Home from "./pages/Home";
import ProductDetails from "./components/ProductDetails";
import Login from "./components/Login";
import Registration from "./components/Registration";
import ForgotPassword from "./components/ForgotPassword";
import PasswordResetConfirm from "./components/PasswordConfirm";
import Cart from "./components/Cart";
import DefaultLayout from "./layout/DefaultLayout";
import ConfirmOrder from "./components/ConfirmOrder";
import MyOrders from "./components/MyOrders";
import OrderDetails from "./components/OrderDetails";
import Category from "./components/Category";
import ProductLayout from "./layout/ProductLayout";
import Search from "./components/Search";
import Brands from "./admin/Brands";
import Sizes from "./admin/Size";
import Categorys from "./admin/Category";
import ProductsAdmin from "./admin/Product";
import ProductVariant from "./admin/ProductVariant";
// const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 10);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Router>
      {" "}
      {/* Move CartProvider here */}
      <div>
        <Toaster
          position="top-right"
          reverseOrder={false}
          containerClassName="overflow-auto"
        />
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route path="/:query?" element={<Home />} />
            <Route path="/brand" element={<Brands />} />
            <Route path="/size" element={<Sizes />} />
            <Route path="/category" element={<Categorys />} />
            <Route path="/product" element={<ProductsAdmin />} />
            <Route path="/product-variant" element={<ProductVariant />} />
          </Route>
          <Route path="/p" element={<ProductLayout />}>
            <Route path="/p/category/men/:query?" element={<Category />} />
            <Route path="/p/search/:query?" element={<Search />} />
            <Route path="/p/category/women/:query?" element={<Category />} />
            <Route path="/p/product/:id" element={<ProductDetails />} />
            <Route path="/p/cart/:token?" element={<Cart />} />
            <Route path="/p/confirm-order" element={<ConfirmOrder />} />
            <Route path="/p/orders" element={<MyOrders />} />
            <Route path="/p/order-detail" element={<OrderDetails />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/confirm-password/:uidb/:token/"
            element={<PasswordResetConfirm />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
