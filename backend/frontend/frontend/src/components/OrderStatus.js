import React, {useEffect,useState} from "react";
import { useParams } from "react-router-dom";
import './OrderStatus.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";



const OrderStatus = () =>{
    const {id} = useParams();
    const [order, setOrder] = useState();
    const navigate = useNavigate(); 
    const [proceedToCheckout, setProceedToCheckout] = useState(false);

    useEffect(()=>{
      if (!id) {
        console.log("No order id provided in the URL");
        return;
      }

      fetch(`https://fashion-marketplace-9.onrender.com/order/${id}/`,{
          method: "GET",
          headers :{
              "Authorization" :`Bearer ${localStorage.getItem("access_token")}`,
              "content-type": "application/json"
          }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Http error ${res.status}`);
        }
        return res.json();
      })
      .then(data =>{
          console.log("Order data:", data); 
          setOrder(data);
          
              
          
      })
      .catch(error => console.error("Order fetch failed:", error))
  },[id]);
  useEffect(()=>{
    const handleUnload = async () =>{
      if (!proceedToCheckout && !id) {
        try {
          await axios.post("https://fashion-marketplace-9.onrender.com/store/abandoned-order/",{
            order_id:id
          },{
            headers: {
              "Authorization": `Bearer ${localStorage.setItem("access_token")}`,
              "Content-Type":"Application/json"
            }
          });
        } catch (err) {
          console.error("Failed to report abandoned order:",err);
        }
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  },[proceedToCheckout, id]);
    if (!order) return <p>Loading...</p>;
    

    return (
      <div className="order-confirmation">
      <h2>Order Confirmed!</h2>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Items:</strong></p>
      <ul className="order-items-list">
      {order.items.map((item, index) => {
    const imageUrl = item.product.image?.startsWith("http")
      ? item.product.image
      : `http://127.0.0.1:8000${item.product.image}`;

    return (
      <li key={index} className="order-item">
        <img
          src={imageUrl}
          alt={item.product.name}
          className="order-item-image"
        />
        <div className="order-item-details">
          <p className="order-item-name">{item.product.name}</p>
          <p>{item.quantity} pcs</p>
          <p>${item.price}</p>
        </div>
      </li>
    );
  })}
      </ul>
      <button 
      onClick={() => {
        setProceedToCheckout(true); // Prevent zoho from trigerring
        navigate(`/checkout/${order.id}`)}}
      >Proceed to Checkout</button>
    </div>
      );
};
export default OrderStatus;
