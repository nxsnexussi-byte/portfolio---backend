require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const emailjs = require('@emailjs/nodejs'); // Naya package use kar rahe hain

const app = express();
app.use(cors());
app.use(express.json());

// Database Model
const Contact = mongoose.models.Contact || mongoose.model('Contact', new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
}));

// --- ROUTE ---
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // 1. Database mein Save (Backup ke liye acha hai)
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        console.log("✅ Data saved to MongoDB");

        // 2. EmailJS Setup
        // Dhyaan rakhna: Template mein {{from_name}}, {{from_email}}, aur {{message}} likha hona chahiye
        const templateParams = {
            from_name: name,    // Upar wale section ke liye
            from_email: email,  // Upar wale section ke liye
            message: message,   // Dono jagah message ke liye
            name: name,         // Neeche icon ke paas wale bold name ke liye
            time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) // Sahi time ke liye
        };

        console.log("⏳ Sending Email via EmailJS...");

        const response = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            templateParams,
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY,
                privateKey: process.env.EMAILJS_PRIVATE_KEY,
            }
        );

        console.log("📧 Email Sent Successfully:", response.text);

        res.status(201).json({
            success: true,
            message: "Message received & Email sent via EmailJS! ✅"
        });

    } catch (err) {
        console.error("❌ ERROR:", err);
        res.status(500).json({
            success: false,
            message: "Server error: " + err.message
        });
    }
});

// Server & DB Connection
const PORT = 5000;
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("✅ Database Connected");
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch(err => console.error("❌ DB Connection Error:", err.message));