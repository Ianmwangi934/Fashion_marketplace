import React, {useEffect, useState} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './OrderCheckout.css';
import { useNavigate } from "react-router-dom";



const OrderCheckout = () =>{
    const {orderId} = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] =useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    

    useEffect(()=>{
        const fetchOrder = async () =>{
            try {
                const response = await axios.get(`http://127.0.0.1:8000/store/checkout/${orderId}`,{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json",
                    }
                });
                setOrder(response.data);
                console.log(response.data)
                
            } catch (err) {
                console.error(err);
                setError("Failed to fetch order details");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    },[orderId]);

    if (loading) return <p>Loading order ...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="checkout-container">
      <h2>Checkout</h2>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Shipping Address:</strong> {order.shipping_address.address},
      {order.shipping_address.city} - {order.shipping_address.phone}
      </p>
      <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}</p>

      <h3>Items Ordered</h3>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.quantity} x {item.product.name} - ${item.price}
          </li>
        ))}
      </ul>

      <p><strong>Total:</strong> ${order.total}</p>

      <button className="btn btn-primary" onClick={()=>navigate(`/payment-options/${orderId}`)}>Confirm and Pay</button>
    </div>
    );

};
export default OrderCheckout;
