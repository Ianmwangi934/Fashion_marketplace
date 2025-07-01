import React, {useState}from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./PaymentOptions.css";


const PaymentOptions = () =>{
    const {orderId} = useParams();
    const navigate = useNavigate();
    const [loading, setLoadig] = useState(false);
    const [mpesaPhone, setMpesaPhone] = useState("");
    const [mpesaAmount, setMpesaAmount] = useState("");
    const [showMpesaModal, setShowMpesaModal] = useState(false);

    const goToStripe = () =>{
        navigate(`/checkout-form/${orderId}`);
    };

   
        
    const goToPayPal = async () => {
        setLoadig(true);
        try {
            const res = await axios.post(
                `http://127.0.0.1:8000/store/create-paypal-order/${orderId}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                }
            );

            const { links } = res.data;
            const approvalLink = links.find((link) => link.rel === "approve");

            if (approvalLink) {
                window.location.href = approvalLink.href;
            } else {
                alert("No approval link found");
                setLoadig(false);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to create PayPal order");
            setLoadig(false);
        }
    };
    const handleMpesaPayment = async () => {
        if (!mpesaPhone || !mpesaAmount) return alert("Enter phone and amount");

        try {
            const res = await axios.post("http://127.0.0.1:8000/store/stk-push/", {
                phone: mpesaPhone,
                amount: mpesaAmount,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            alert("✅ STK Push sent to phone");
            console.log(res.data);
            setShowMpesaModal(false);
        } catch (err) {
            console.error(err);
            alert("❌ M-Pesa Payment Failed");
        }
    };

    return (
        
            <div className="payment-options-container">
            <h2>Select Payment Method</h2>
            <div className="payment-cards">
                <div className="payment-card stripe" onClick={goToStripe}>
                    <h3>💳Pay with Stripe</h3>
                    <p>Use your credit card or debit card</p>
                    <button>Pay With Stripe</button>


                </div>
                <div className="payment-card paypal" onClick={goToPayPal}>
                    <h3>🟡 Pay with PayPal</h3>
                    <p>Use your PayPal Account</p>
                    <button onClick={goToPayPal} disabled={loading} className={loading ? "loading": ""}>
                        {loading ? "Redirecting to PayPal": "Pay With PayPal"}</button>

                </div>
                <div className="payment-card mpesa" onClick={() => setShowMpesaModal(true)}>
                        <h3>📱 Pay with M-Pesa</h3>
                        <p>Pay via STK Push on your phone</p>
                        <button>Pay With M-Pesa</button>

                </div>

            </div>
            {showMpesaModal && (
                    <div className="mpesa-modal">
                        <div className="mpesa-modal-content">
                            <h3>Enter M-Pesa Details</h3>
                            <input
                                type="text"
                                placeholder="Phone (07...)"
                                value={mpesaPhone}
                                onChange={e => setMpesaPhone(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                value={mpesaAmount}
                                onChange={e => setMpesaAmount(e.target.value)}
                            />
                            <div className="modal-buttons">
                                <button onClick={handleMpesaPayment}>Send STK Push</button>
                                <button onClick={() => setShowMpesaModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            
            
        </div>

        
        
    );
};
export default PaymentOptions;