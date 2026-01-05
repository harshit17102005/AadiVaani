const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
if (!fs.existsSync(CONTACTS_FILE)) {
    fs.writeFileSync(CONTACTS_FILE, '[]');
}

// Routes
app.get('/', (req, res) => {
    res.send('AadiVaani Backend is Running');
});

// Contact Endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, query } = req.body;

    if (!name || !email || !query) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newContact = {
            id: Date.now(),
            name,
            email,
            query,
            date: new Date().toISOString()
        };

        // 1. Save to File
        const fileData = fs.readFileSync(CONTACTS_FILE);
        const contacts = JSON.parse(fileData);
        contacts.push(newContact);
        fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));

        // 2. Send Email (Optional - requires configuration)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: 'gmail', // Or use host/port from env
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'support@aadivaani.in', // Target email
                subject: `AadiVaani Query: ${name}`,
                text: `Name: ${name}\nEmail: ${email}\n\nQuery:\n${query}`
            };

            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully");
        } else {
            console.log("Email configuration missing. Saved to file only.");
        }

        res.status(200).json({ message: 'Message received successfully' });

    } catch (error) {
        console.error('Error processing contact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const axios = require('axios');

// ... (previous imports)

// ... (middleware and setup)

// Translation Endpoint
app.post('/api/translate', async (req, res) => {
    const { text, source, target } = req.body;

    if (!text || !source || !target) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await axios.get(url);

        if (response.data && response.data[0]) {
            const translatedText = response.data[0].map(item => item[0]).join("");
            res.json({ translatedText });
        } else {
            res.status(500).json({ error: 'Translation failed upstream' });
        }
    } catch (error) {
        console.error('Translation error:', error.message);
        res.status(500).json({ error: 'Translation server error' });
    }
});

// ... (keep contact endpoint)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
