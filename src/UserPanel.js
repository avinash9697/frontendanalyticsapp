import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserPanel = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [sourcesForSelectedDepartment, setSourcesForSelectedDepartment] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [fromDate,setFromDate]= useState("")
  const [toDate,setToDate]= useState("");
  const [latestDate,setLatestDate]= useState("");
  const [isLoading,setLoading]=useState(false);
  const [file,setFile]= useState(null)
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment && selectedSource && fromDate) {
      getLatestDate();
    }
  }, [selectedDepartment, selectedSource, fromDate]);

  const changeFromData = (e)=> {
    const fromDateValue = e.target.value;
    const fromDate = new Date(fromDateValue);

    const toDateInput = document.getElementById("to");
    toDateInput.min=fromDateValue; 

    const lastDay = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0).getDate();
    const toDateValue = toDateInput.value
    const maxDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), lastDay);
    maxDate.setDate(maxDate.getDate() + 1);
    toDateInput.value="";
    toDateInput.max = maxDate.toISOString().split('T')[0];

    if (toDateValue) {
      const selectedDay = new Date(toDateValue).getDate();
      toDateInput.value = new Date(maxDate.getFullYear(), maxDate.getMonth(), selectedDay).toISOString().split('T')[0];
    }

    setFromDate(fromDateValue)
  }

  const changeToDate= (e)=> {
    const toDateValue = e.target.value;
    setToDate(toDateValue)
  }

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("https://analyticsappbackend.onrender.com/getDepartments");
      setDepartments(response.data.departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchSourcesForDepartment = async (department) => {
    try {
      const response = await axios.get(`https://analyticsappbackend.onrender.com/getSourcesForDepartment/${department}`);
      setSourcesForSelectedDepartment(response.data.sources);
    } catch (error) {
      console.error(`Error fetching sources for department ${department}:`, error);
    }
  };

  const handleDepartmentChange = (event) => {
    const selectedDepartment = event.target.value;
    setSelectedDepartment(selectedDepartment);

    fetchSourcesForDepartment(selectedDepartment);
  };

  const logout = ()=> {
    navigate("/")

  }

  const handleSourceChange = (event) => {
    setSelectedSource(event.target.value);
  };

  const changeFile = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile)
  }

  const getLatestDate= async()=> {
    try{
      const response = await axios.get(`https://analyticsappbackend.onrender.com/getLatestDate/${selectedDepartment}/${selectedSource}?fromDate=${fromDate}`);
      const data = response.data;
      if (data.latestDate !== null) {
        setLatestDate(`${data.latestDate} of ${data.monthYear} is the last date of file upload`);
        setTimeout(()=> setLatestDate(""),10000)
      } else {
        setLatestDate("No data found for the selected criteria.");
        setTimeout(()=> setLatestDate(""),10000)
      }
    } catch (error) {
      console.error("Error occurred while fetching the latest date:", error);
      setLatestDate("Error occurred while fetching the latest date.");
      setTimeout(()=> setLatestDate(""),5000)
    }
  }

  

  const uploadFile = async(event)=> {
    setErrorMsg("");
    setSuccessMsg("")
    setLoading(true)

    event.preventDefault();
        const formData = new FormData();
        formData.append('file',file);
        formData.append('selectedDepartment',selectedDepartment);
        formData.append('selectedSource',selectedSource);
        formData.append('fromDate',fromDate);
        formData.append('toDate',toDate)

        try {
          await axios.post('https://analyticsappbackend.onrender.com/upload', formData, {
            headers: {'Content-Type':'multipart/form-data'}
          }).then(response => {
            document.getElementById("from").value = "";
            document.getElementById("to").value = "";

            setSelectedDepartment("");
            setSelectedSource("");
            setFromDate("");
            setToDate("")

            if (response.data.status === "failure"){
              if (response.data.error){
                const failureMsgError = response.data.error;
                setErrorMsg(failureMsgError)
                setSuccessMsg("");
                setTimeout(()=> setErrorMsg(""),5000);
              } else if (response.data.missing_dates){
                const missingDates = response.data.missing_dates.join(', ');
                const failureMsgError = `${missingDates} dates data is missing. Please upload them.`;
                setErrorMsg(failureMsgError);
                setSuccessMsg("");
                setTimeout(()=> setErrorMsg(""),5000)
              } else {
                const failureMsgError = "File upload failed. Please try again.";
                setErrorMsg(failureMsgError)
                setSuccessMsg("");
                setTimeout(()=>setErrorMsg(""),5000)
              }
            } else if (response.data.status==="success") {
               setSuccessMsg("File Uploaded successfully")
               setErrorMsg("");
               setTimeout(()=> setSuccessMsg(""),5000)
            }
          })
        }catch(error){
          if (error.response && error.response.data && error.response.data.error){
            setErrorMsg(error.response.data.error)
            setTimeout(() => setErrorMsg(''), 10000);
          }
        }finally{
          setLoading(false)
        }
  }

  return (
    <div>
      <h2>User Panel</h2>
      <form>
        <div>
          <label>Select Department:</label>
          <select value={selectedDepartment} onChange={handleDepartmentChange}>
            <option value="">Select a department</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
        {selectedDepartment && (
          <div>
            <label>Select Source:</label>
            <select value={selectedSource} onChange={handleSourceChange}>
              <option value="">Select a source</option>
              {sourcesForSelectedDepartment.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
        )}
        {latestDate && <p style={{ color: "green" }}>{latestDate}</p>}
        <div className="from-date">
            <value for="from" className="from-label">From</value>
            <input id="from" onChange={changeFromData} type="date" value={fromDate}/>
        </div>
        <div className="to-date">
            <value for="to" className="to-label">To</value>
            <input id="to" onChange={changeToDate} type="date" value={toDate}/>
        </div>
        <input type="file" onChange={changeFile}
        />
        <button onClick={uploadFile}>Upload</button>
      </form>
      {isLoading && <p style={{ color: "green" }}>Please Wait your file is being uploaded</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default UserPanel;
