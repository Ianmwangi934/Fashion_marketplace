import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './PaymentSuccess.css';

const PaymentSuccess = () =>{
    const {orderId} = useParams();
    const [order, setOrder] = useState(null);
    useEffect(() => {
      // Apply dark class to body
      document.body.classList.add("PaymentSuccess");

      // Clean up when component unmounts
      return () => {
          document.body.classList.remove("PaymentSuccess");
      };
  }, []);

    useEffect(() =>{
        // Marking order as shipped
        axios.post(`https://fashion-marketplace-9.onrender.com/store/order/shipped/${orderId}/`,{},{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
        });

        // Fetching updated status
        axios.get(`https://fashion-marketplace-9.onrender.com/store/order/${orderId}/`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
        }).then(res =>{
            setOrder(res.data);
        });
    }, [orderId]);
    const handleDownloadReceipt = () =>{
        window.print(); // simple way to allow printing or download

    };
    if (!order) return <p>loading .....</p>
    return (
        <div className="payment-success">
      <h2>✅ Payment Successful!</h2>
      <p>Your order <strong>#{order.id}</strong> has been marked as <strong>{order.status}</strong>.</p>

      <h3>Receipt:</h3>
      <ul>
        {order.items.map((item, idx) => (
          <li key={idx}>{item.product.name} x{item.quantity} - ${item.price}</li>
        ))}
      </ul>
      <p>Total: ${order.items.reduce((sum, i) => sum + (parseFloat(i.price) * i.quantity), 0).toFixed(2)}</p>


      <button onClick={handleDownloadReceipt}>📄 Download Receipt</button>
    </div>
  );
    
};
export default PaymentSuccess;
