import React from "react";
import { Link, Outlet } from "react-router-dom";
import {
  FaCartPlus,
  FaBoxOpen,
  FaShippingFast,
  FaUserPlus,
  FaSignInAlt,
  FaCreditCard,
} from "react-icons/fa";
import "./MainLayout.css"; // 👈 Ensure this is imported

const MainLayout = () => {
  return (
    <div className="main-layout">
      <nav className="navbar">
        <Link to="/upload"><FaSignInAlt /> Upload Product</Link>
        <Link to="/products"><FaSignInAlt /> View Products</Link>
        <Link to="/cart"><FaCartPlus /> Cart</Link>
        <Link to="/shipping"><FaShippingFast /> Shipping Info</Link>
        <Link to="/placeorder"><FaBoxOpen /> Place Order</Link>
        <Link to="/checkout"><FaCreditCard /> Checkout</Link>
        <Link to="/login"><FaUserPlus /> Login</Link>
        <Link to="/register"><FaUserPlus /> Register</Link>
      </nav>

      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
