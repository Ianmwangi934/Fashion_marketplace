import React, { useContext } from "react";
import { CartContext } from "../CartContext";
import { Link } from "react-router-dom";
import "./CartPage.css";
import {useNavigate} from "react-router-dom";

const CartPage = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const handleProceedToShipping = () =>{
    navigate("/placeorder")
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p style={{ textAlign: "center" }}>Your cart is empty</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {cartItems.map((item) => (
            <li className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="cart-item-details">
                <Link to={`/product/${item.id}`}>{item.name}</Link>
                <p>${item.price} x {item.quantity}</p>
                <p><strong>Total: ${(item.price * item.quantity).toFixed(2)}</strong></p>
              </div>
              <button
                className="remove-button"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </li>
          ))}
          < button
      className="shipping-button"
      onClick={handleProceedToShipping}
      >Proceed To Shipping</button>
        </ul>
      )}
      <h3 className="cart-total">Cart Total: ${total.toFixed(2)}</h3>
      
    </div>
  );
};

export default CartPage;
