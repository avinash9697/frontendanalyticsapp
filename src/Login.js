import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./Login.css";

const Login = () => {
    const navigate = useNavigate(); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg,setSuccessMsg]= useState("");

    const handleLogin = async (e) => {
      e.preventDefault();

      if (!username || !password) {
        setErrorMsg('Username and password are required');
        return;
      }
  
      try {
        const response = await axios.post("http://localhost:3003/login",{
            username,password
        });

        setSuccessMsg("Login Successful");
        const admin = response.data;

        if (
          admin.role === "admin"
        ) {
          navigate("/admin");
        } else if(admin.role==="user") {
            navigate("/user")
        }
        else {
          setErrorMsg('Invalid credentials');
          setTimeout(() => setErrorMsg(''), 10000);
        }
      } catch (error) {
        console.error("Error occurred during login:", error);
        setErrorMsg('An error occurred during login. Please try again later.');
        setTimeout(() => setErrorMsg(''), 10000);
      }
    };
  
    return (
      <div className="div">
        <form className="form" onSubmit={handleLogin}>
          <div className="username">
            <label className="label" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="password">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
          {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        </form>
      </div>
    );
  };
  
  export default Login;