import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Login';
import AdminPanel from './AdminPanel';
import UserPanel from './UserPanel';

const App =()=>{
    return(
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/user"  element={<UserPanel/>}/>
        </Routes>
      </Router>
    )
}


export default App;
