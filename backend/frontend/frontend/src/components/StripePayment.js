import React, {useState} from "react";
import {CardElement, useStripe,useElements} from "@stripe/react-stripe-js";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./StripePayment.css";


const CheckoutForm = () =>{
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const {orderId} = useParams();
    const navigate = useNavigate();

    

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(!stripe || !elements) return;
        setLoading(true);
        let clientSecret = "";
        // Only request PaymentIntent when user clicks Pay
        try {
            const res = await axios.post(`https://fashion-marketplace-10.onrender.com/store/create-payment-intent/${orderId}/`,{},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            }
            );
            clientSecret=res.data.clientSecret;
            setClientSecret(clientSecret)


        } catch (err) {
            setMessage("Failed to intiate payment");
            setLoading(false);
            return; // stop execution if fetching failed
        }

        
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card:elements.getElement(CardElement),
            },
        });
        if (result.error) {
            setMessage(result.error.message);
        } else {
            if (result.paymentIntent.status === "succeeded") {
                setMessage("Payment succeeded");
            }
        }
        setLoading(false);
        navigate(`/payment-success/${orderId}`)
    };
    return (
        <div className="checkout-form-container">
            <form onSubmit={handleSubmit}>
            <CardElement className="StripeElement"/>
            <button type="submit" disabled={!stripe || loading} >
                {loading ? "Processing..." : "Pay Now"}
            </button>
            {message && <p>{message}</p>}
            
        </form>

        </div>
        
    );
    
};
export default CheckoutForm;

