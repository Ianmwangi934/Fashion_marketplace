import React, {useState,useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Register.css';
import bgImage from "../assets/Fashion.jpg";

const Register = () =>{
    const [form, setForm] = useState({username:"", password:"", email:""});
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Apply dark class to body
        document.body.classList.add("register-dark");

        // Clean up when component unmounts
        return () => {
            document.body.classList.remove("register-dark");
        };
    }, []);


    const handleChange = (e)=>{
        setForm({ ...form, [e.target.name]: e.target.value});
    };

    const handleRegister = async (e)=>{
        e.preventDefault();

        try{
            const response = await axios.post("http://127.0.0.1:8000/store/register/", form);

            // Save token and redirect
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_toke", response.data.refresh);
            axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;

            navigate("") //Redirect the user to homepage

        }catch (err){
            setError(err.response?.data?.error || "Registration failed");
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
          }} >
            <form className="register-form" onSubmit={handleRegister}>
            <h2 className="form-title">Create an account</h2>

            {error && <p className="error">{error}</p>}
            <input 
            type = "text"
            name = "username"
            placeholder="username"
            value={form.username}
            onChange={handleChange}
            required
            className="form-input"
            />
            <input 
            type="email"
            name="email"
            placeholder="email"
            value = {form.email}
            onChange = {handleChange}
            required
            className="form-input"
            />

            <input
            type="password"
            name="password"
            placeholder="password"
            value = {form.password}
            onChange = {handleChange}
            required
            className="form-input"
            />

            <button type="submit" className="form-button">Register</button>
        </form>

        </div>
        
    );
};
export default Register;