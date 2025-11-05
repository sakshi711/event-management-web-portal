const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());

// ================================
// DATABASE CONNECTION
// ================================
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // replace with your actual password
  database: 'event_portal'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL Connected');
});

// ================================
// DEFAULT ROUTE
// ================================
app.get('/', (req, res) => {
  console.log('✅ Default route hit');
  res.send('🎯 Event Management API is running...');
});

// ================================
// EVENT ROUTES
// ================================
app.get('/events', (req, res) => {
  const query = 'SELECT * FROM events ORDER BY date ASC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.post('/events', (req, res) => {
  const { title, date, location, description } = req.body;
  const query =
    'INSERT INTO events (title, date, location, description) VALUES (?, ?, ?, ?)';
  db.query(query, [title, date, location, description], (err, result) => {
    if (err) {
      console.error('Error adding event:', err);
      return res.status(500).json({ error: 'Failed to add event' });
    }
    res.json({ message: 'Event added successfully', event_id: result.insertId });
  });
});

app.delete('/events/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM events WHERE event_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting event:', err);
      return res.status(500).json({ error: 'Failed to delete event' });
    }
    res.json({ message: 'Event deleted successfully' });
  });
});

app.post('/register', (req, res) => {
  const { user_name, user_email, event_id } = req.body;
  const query =
    'INSERT INTO registrations (user_name, user_email, event_id) VALUES (?, ?, ?)';
  db.query(query, [user_name, user_email, event_id], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ error: 'Registration failed' });
    }
    res.json({ message: 'Registration successful' });
  });
});

app.get('/registrations', (req, res) => {
  const query = `
    SELECT r.reg_id, r.user_name, r.user_email, e.title AS event_title
    FROM registrations r
    JOIN events e ON r.event_id = e.event_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching registrations:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// ================================
// START SERVER
// ================================
const PORT = 5050;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
