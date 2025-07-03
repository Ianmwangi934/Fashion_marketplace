import axios from "axios";
import { useNavigate } from "react-router-dom";
import { React,useState } from "react";
import bgImage from "../assets/shipping.jpg";
import './PlaceOrder.css';

const PlaceORder = () =>{
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [shipping, setShipping] = useState({
        first_name: '',
        last_name:'',
        phone:'',
        address:'',
        city:'',
        county:'',
        landmark:'',
        country:''
    })
    
    const handleChange = (e)=>{
        setShipping({...shipping, [e.target.name]: e.target.value});
    };

    const handlePlaceOrder = async () =>{
        setLoading(true);
        try{
            const token = localStorage.getItem("access_token");
            const response =await axios.post("https://fashion-marketplace-9.onrender.com/store/orders/create/",{shipping_address:shipping,}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            const orderId = response.data.id;
            navigate(`/order-status/${orderId}`);
            
           
        }catch (err) {
            console.error(err);
            setError("Could not place order");
        }finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <div className="container" >
            <h2>Shipping Information</h2>
            {error && <p style={{color: "red"}}>{error}</p>}
            {/* shipping form */}
            <input name="first_name" placeholder="First Name" onChange={handleChange} required />
            <input name="last_name" placeholder="Last Name" onChange={handleChange} required />
            <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
            <input name="address" placeholder="Address" onChange={handleChange} required />
            <input name="city" placeholder="City" onChange={handleChange} required />
            <input name="county" placeholder="County" onChange={handleChange} required />
            <input name="landmark" placeholder="Landmark" onChange={handleChange} required />
            <input name="country" placeholder="Country" onChange={handleChange} required />
            <button onClick={handlePlaceOrder} disabled={loading} className="PlaceOrderbtn">
                {loading ? "Placing order...": "Place order"}
            </button>
        </div>

        </div>
        
    );

};
export default PlaceORder;
