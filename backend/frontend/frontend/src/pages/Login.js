import React, {useState,useEffect,useContext} from "react";
import { loginUser } from "../api/auth";
import {useNavigate} from "react-router-dom";
import './Login.css';
import bgImage from "../assets/login.png";
import { CartContext } from "../CartContext";



const Login = () =>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const {fetchCartItems} = useContext(CartContext);
    const navigate = useNavigate();
    useEffect(() => {
        // Apply dark class to body
        document.body.classList.add("login-dark");

        // Clean up when component unmounts
        return () => {
            document.body.classList.remove("login-dark");
        };
    }, []);

    const handleLogin = async (e) =>{
        e.preventDefault();
        setError(""); //clear any existing error
        try{
            await loginUser(username, password);

            try{
                await fetchCartItems();
            }catch(cartErr) {
                console.warn("Cart fetch failed", cartErr);
            }
            navigate("/"); // Redirect the user to home page after success login
        }catch(err) {
            console.error("Login failed:", err);
            setError("Invalid Username or password");
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
            <form onSubmit={handleLogin}>
            <h1>Login</h1>
            {error && <p style={{color: "red"}}>{error}</p>}
            <input
            type="text"
            placeholder ="username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            required
            />
            <input
            type="password"
            placeholder = "password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            />
            <button type="submit" className="Loginbtn">Login</button>
            
           
        </form>

        </div>
        
    );
};
export default Login;