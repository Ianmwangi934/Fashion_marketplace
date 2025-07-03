import React, {useState} from "react";
import axios from "axios";
import './shipping-form.css';
import bgImage from "../assets/shipping.jpg";
import { useNavigate } from "react-router-dom";


function ShippingForm({onContinue}) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name:'',
        phone:'',
        address:'',
        city:'',
        county:'',
        landmark:'',
        country:''
    });

     

    const handleChange = (e) =>{
        setFormData(prev =>({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();

        try {
            await axios.post("https://fashion-marketplace-9.onrender.com/store/shipping-address/",formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            
            navigate("/PlaceOrder")

        } catch (error) {
            console.log("Error saving shipping address", error);
        }
    };

    return (
        
        <div className="login-container" style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }} >
            <form onSubmit={handleSubmit} className="shipping-form">
            <h1>Shipping Information</h1>
            {["first_name","last_name","phone","address","city","county","landmark","country"].map(field =>(
                <input 
                    key={field}
                    type= "text"
                    name = {field}
                    placeholder = {field.replace("_","").toUpperCase()}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="form-input"
                />
            ))}
            <button type="submit" className="submit-btn">Continue to Checkout</button>
        </form>

        </div>
        
    );
}

export default ShippingForm;
