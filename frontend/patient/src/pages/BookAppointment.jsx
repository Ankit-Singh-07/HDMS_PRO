import React, { useState } from "react";
import axios from "axios";

export default function BookAppointment() {
  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    time: "",
    problem: ""
  });

  const handleSubmit = async () => {
    const patientId = localStorage.getItem("userId");

    await axios.post("http://localhost:5000/api/appointments", {
      ...form,
      patientId
    });

    alert("Appointment Booked!");
  };

  return (
    <div>
      <h2>Book Appointment</h2>

      <input placeholder="Doctor ID"
        onChange={(e)=>setForm({...form,doctorId:e.target.value})}/>

      <input type="date"
        onChange={(e)=>setForm({...form,date:e.target.value})}/>

      <input type="time"
        onChange={(e)=>setForm({...form,time:e.target.value})}/>

      <textarea placeholder="Problem"
        onChange={(e)=>setForm({...form,problem:e.target.value})}/>

      <button onClick={handleSubmit}>Book</button>
    </div>
  );
}