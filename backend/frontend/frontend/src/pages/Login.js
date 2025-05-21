import React, {useState,useEffect} from "react";
import { loginUser } from "../api/auth";
import {useNavigate} from "react-router-dom";
import './Login.css';


const Login = () =>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
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
        try {
            await loginUser(username, password);
            navigate("/") //Redirects the user to s specified route(in this case /)

        }catch(err){
            setError("Invalid username or password");
        }
        
    
    

    };

    return (
        <div className="login-container">
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
            <button type="submit">Login</button>
            
           
        </form>

        </div>
        
    );
};
export default Login;