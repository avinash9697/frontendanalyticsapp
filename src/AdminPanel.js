import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState('user');
  const [errorMsgAddUser, setErrorMsgAdd] = useState("");
  const [successMsgAddUser,setSuccessMsgAdd]= useState("");
  const [department, setDepartment] = useState("");
  const [source, setSources] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const logout = ()=>{
    navigate("/")
  }


  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://analyticsappbackend.onrender.com/addUser", {
        username,
        password,
        role,
      });

      setSuccessMsgAdd('User added successfully!');
      setErrorMsgAdd('');

      setUsername("");
      setPassword("");
      setRole("");

      console.log("New user added:", response.data);
    } catch (error) {
      console.error("Error occurred while adding user:", error);
      setErrorMsgAdd("An error occurred while adding user. Please try again later.");
      setSuccessMsgAdd("")
    }
  };

  const handleAddDepartmentAndSource = async(e)=>{
    e.preventDefault()
    if (!department || !source) {
      setErrorMsg("Department name and sources are required.");
      return;
    }

    try{
      const response = await axios.post("https://analyticsappbackend.onrender.com/addDepartmentAndSource", {
      department,
      source,
      });

      setSuccessMsg(response.data.message);
      setErrorMsg("");
    }catch(error){
      console.error("Error occurred while adding department and source:", error);
      setErrorMsg("An error occurred. Please try again later.");
    }
  }

  return (
    <div>
      <div>
        <form onSubmit={handleAddUser}>
          <div>
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label>Role</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
          </div>
          <button type="submit">Add User</button>
        </form>
        <button onClick={logout}>Logout</button>
        {successMsg && <p  style={{ color: "green" }}>{successMsg}</p>}
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      </div>
      <div>
        <form onSubmit={handleAddDepartmentAndSource}>
          <div>
            <label>Department Name</label>
            <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} />
          </div>
          <div>
            <label>Sources</label>
            <input type="text" value={source} onChange={(e) => setSources(e.target.value)} />
          </div>
          <button type="submit">Add Department and Sources</button>
        </form>
        {successMsg && <p style={{ color: "green" }}>{successMsgAddUser}</p>}
        {errorMsg && <p style={{ color: "red" }}>{errorMsgAddUser}</p>}
      </div>
    </div>
  );
};

export default AdminPanel;
