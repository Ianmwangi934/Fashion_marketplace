import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProductForm from "./components/ProductForm";
import ProductDetail from "./components/ProductDetail";
import CartPage from "./components/CartPage";
import StorePage from "./components/StorePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingForm from "./components/ShippingForm";
import PlaceORder from "./components/PlaceOrder";
import OrderStatus from "./components/OrderStatus";
import OrderCheckout from "./components/OrderCheckout";
import CheckoutWrapper from "./components/CheckoutWrapper";
import PayPalButton from "./components/PayPalButton";
import PaymentOptions from "./components/PaymentOptions";
import MpesaPay from "./components/mpesa";
import PaymentSuccess from "./components/PaymentSuccess";
import MainLayout from "./layouts/MainLayout";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51Rc3OyQR9SYQY3Zz9fC2j6sLwEpKUFLmx84AfyYCmGZ9LTn96XA8TyWIuOSbprQmtx2LtSI7qBdaeqMhEA6P0v0H00i2Hp7Upc")

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Main Layout Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/products" />} />
          <Route path="/upload" element={<ProductForm />} />
          <Route path="/products" element={<StorePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shipping" element={<ShippingForm />} />
          <Route path="/placeorder" element={<PlaceORder />} />
          <Route path="/order-status/:id" element={<OrderStatus />} />
          <Route path="/checkout/:orderId" element={<OrderCheckout />} />
          <Route path="/checkout-form/:orderId" element={<CheckoutWrapper />} />
          <Route path="/paypal-payment/:orderId" element={<PayPalButton />} />
          <Route path="/payment-options/:orderId" element={<PaymentOptions />} />
          <Route path="/mpesa-payment" element={<MpesaPay />} />
          <Route path="/payment-success/:orderId" element={<PaymentSuccess />} />
        </Route>
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;
