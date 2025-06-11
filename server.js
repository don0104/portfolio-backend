const express = require('express');
const cors = require('cors');

const app = express();

// Basic CORS setup
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Simple test route
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.json({ message: 'Server is working!' });
});

// Health check
app.get('/health', (req, res) => {
  console.log('Health check accessed');
  res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server URL: http://localhost:${PORT}`);
}); 