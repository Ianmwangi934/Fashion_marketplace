import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PayPalButton = () =>{
    const {orderId} = useParams();

    const handlePayPalClick = async () =>{
        try {
            const res = await axios.post(`http://127.0.0.1:8000/store/create-paypal-order/${orderId}/`,{}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            const {links} = res.data;
            const approvalLink = links.find((link)=> link.rel === "approve");

            if (approvalLink) {
                window.location.href = approvalLink.href; // Redirecting to paypal
            } else{
                alert("No approval link found");
            }
        } catch (err){
            console.error(err);
            alert("Failed to create paypal order");
        }
    };

    return (
        <button onClick={handlePayPalClick} className="paypal-button">Pay with PayPal</button>
    );
}
export default PayPalButton;