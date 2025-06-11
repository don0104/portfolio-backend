const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// Configure CORS with specific options
app.use(cors({
  origin: '*', // In production, replace with your frontend URL
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.post('/send-email', (req, res) => {
  console.log('Received email request');
  const { name, email, message } = req.body;
  console.log('Form data:', { name, email, message });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  console.log('Sending email...');

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Email error:', error);
      res.status(500).json({ 
        error: 'Error sending email',
        details: error.message 
      });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ 
        message: 'Email sent successfully',
        details: info.response 
      });
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server URL: http://localhost:${PORT}`);
}); 