const express = require('express');
const router = express.Router();

// 🛑 APNE MODELS IMPORT KAREIN 
const Doctor = require('../models/Doctor'); // Doctor model
const User = require('../models/User');     // Patient model (Role: 'patient')
const Appointment = require('../models/Appointment');

// ==========================================
// 1. API: GET /api/admin/dashboard-stats
// ==========================================
// ==========================================
// 1. API: GET /api/admin/dashboard-stats
// ==========================================
router.get('/dashboard-stats', async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments(); 
    const totalPatients = await User.countDocuments({ role: 'patient' }); 

    // Saari appointments database se nikalenge
    const allAppointments = await Appointment.find()
      .populate('patientId', 'name')
      .populate('doctorId', 'name')
      .sort({ createdAt: -1 }); // Sabse nayi upar

    // Aaj ki date nikalne ke liye
    const todayString = new Date().toLocaleDateString('en-IN');
    
    let appointmentsToday = 0;
    let totalRevenue = 0;

    // Har appointment ko check karke Math lagayenge
    allAppointments.forEach(apt => {
      // 1. Aaj ki appointments gino
      const aptDate = new Date(apt.date || apt.createdAt).toLocaleDateString('en-IN');
      if (aptDate === todayString) {
        appointmentsToday++;
      }
      
      // 2. Total Revenue Calculate (Maan lijiye har Confirmed/Completed appointment ki fee ₹500 hai)
      const status = (apt.status || '').toUpperCase();
      if (status === 'COMPLETED' || status === 'CONFIRMED') {
        totalRevenue += 500; // Agar aapke paas fee ka field hai toh apt.fee bhi likh sakte hain
      }
    });

    // 3. Sabse nayi 3 Appointments nikalenge Recent Table ke liye
    const recentAppointments = allAppointments.slice(0, 3).map(apt => ({
      id: apt._id ? apt._id.toString().substring(0,8).toUpperCase() : 'N/A',
      patient: (apt.patientId && apt.patientId.name) || apt.patientName || 'Unknown Patient',
      doctor: (apt.doctorId && apt.doctorId.name) || apt.doctorName || 'Unknown Doctor',
      date: apt.date || apt.createdAt,
      status: apt.status || 'PENDING'
    }));

    // Final Live Data bhej rahe hain
    const stats = {
      totalDoctors,
      totalPatients,
      appointmentsToday, 
      totalRevenue,   
      recentAppointments
    };
    
    res.status(200).json(stats);
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});
// ==========================================
// 4. API: DELETE /api/admin/delete-doctor/:id
// ==========================================
router.delete('/delete-doctor/:id', async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      return res.status(404).json({ message: "Doctor nahi mila!" });
    }

    // Doctor ke sath uska User account (login id) bhi delete karna zaroori hai
    if (doctor.userId) {
      await User.findByIdAndDelete(doctor.userId);
    }

    // Ab doctor ki profile delete karo
    await Doctor.findByIdAndDelete(doctorId);
    
    res.status(200).json({ message: "Doctor successfully deleted!" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Failed to delete doctor", error });
  }
});
// ==========================================
// 5. API: GET /api/admin/patients (Saare patients lane ke liye)
// ==========================================
router.get('/patients', async (req, res) => {
  try {
    // Database se sirf unko layenge jinka role 'patient' hai
    const patients = await User.find({ role: 'patient' }).select('-password').sort({ createdAt: -1 }); 
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Failed to fetch patients", error });
  }
});
// ==========================================
// 6. API: GET /api/admin/appointments (Saari appointments lane ke liye)
// ==========================================
router.get('/appointments', async (req, res) => {
  try {
    // Database se appointments la rahe hain aur unme Patient aur Doctor ka naam jod rahe hain
    const appointments = await Appointment.find()
      .populate('patientId', 'name email phone') 
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: -1 }); // Nayi wali sabse upar
    
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments", error });
  }
});

// ==========================================
// 7. API: PUT /api/admin/appointment/:id/status (Approve/Cancel karne ke liye)
// ==========================================
router.put('/appointment/:id/status', async (req, res) => {
  try {
    const { status } = req.body; // 'Confirmed', 'Cancelled' ya 'Completed'
    const updatedApt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );
    res.status(200).json({ message: `Appointment ${status} successfully!`, appointment: updatedApt });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Failed to update status", error });
  }
});

module.exports = router;