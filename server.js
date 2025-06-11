const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// Configure CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Test route
app.get('/test', (req, res) => {
  res.send('Test successful');
});

// Health check
app.get('/health', (req, res) => {
  res.send('OK');
});

// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Email route
app.post('/send-email', async (req, res) => {
  try {
    console.log('Received request:', req.body);
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

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
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server URL: http://localhost:${PORT}`);
}); 