// simple backend for the event system using MySQL
require('dotenv').config();                       // load .env if present
const express = require('express');
const cors = require('cors');
// const mysql = require('mysql2/promise'); // commented out for demo
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Mock data for demo
let users = [
  {
    id: crypto.randomUUID(),
    email: 'admin@example.com',
    password: 'admin',
    full_name: 'Administrator',
    department: 'IT',
    student_id: null,
    role: 'admin',
  },
  {
    id: crypto.randomUUID(),
    email: 'student@example.com',
    password: 'student',
    full_name: 'Sample Student',
    department: 'Computer Science',
    student_id: 'S12345',
    role: 'student',
  },
];

let sessions = [];

let events = [
  {
    id: crypto.randomUUID(),
    title: 'Orientation Ceremony',
    description: 'Welcome event for new students.',
    date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    attendees_count: 0,
  },
  {
    id: crypto.randomUUID(),
    title: 'Tech Talk: AI in 2026',
    description: 'A guest lecture on the future of artificial intelligence.',
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 19).replace('T', ' '),
    attendees_count: 0,
  },
];

// database connection pool - commented out
// const dbConfig = {
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'eventdb',
//   waitForConnections: true,
//   connectionLimit: 10,
// };

// let pool;

// async function initDb() { ... } // commented out

function generateToken() {
  return crypto.randomUUID();
}

// helper for queries - mock
async function query(sql, params) {
  // Mock implementation
  if (sql.includes('SELECT * FROM users WHERE email = ?')) {
    return users.filter(u => u.email === params[0]);
  }
  if (sql.includes('SELECT 1 FROM users WHERE email = ?')) {
    return users.some(u => u.email === params[0]) ? [1] : [];
  }
  if (sql.includes('SELECT * FROM events')) {
    return events;
  }
  if (sql.includes('SELECT * FROM events WHERE id = ?')) {
    return events.filter(e => e.id === params[0]);
  }
  if (sql.includes('INSERT INTO sessions')) {
    sessions.push({ token: params[0], email: params[1] });
    return [];
  }
  if (sql.includes('DELETE FROM sessions')) {
    sessions = sessions.filter(s => s.token !== params[0]);
    return [];
  }
  if (sql.includes('INSERT INTO users')) {
    const newUser = {
      id: params[0],
      email: params[1],
      password: params[2],
      full_name: params[3],
      department: params[4],
      student_id: params[5],
      role: params[6],
    };
    users.push(newUser);
    return [];
  }
  if (sql.includes('INSERT INTO events')) {
    const newEvent = {
      id: params[0],
      title: params[1],
      description: params[2],
      date: params[3],
      attendees_count: params[4],
    };
    events.push(newEvent);
    return [];
  }
  if (sql.includes('UPDATE events SET attendees_count')) {
    const event = events.find(e => e.id === params[0]);
    if (event) event.attendees_count += 1;
    return { affectedRows: 1 };
  }
  if (sql.includes('DELETE FROM events')) {
    const index = events.findIndex(e => e.id === params[0]);
    if (index > -1) {
      events.splice(index, 1);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }
  if (sql.includes('UPDATE events SET')) {
    const event = events.find(e => e.id === params[params.length - 1]);
    if (event) {
      const keys = sql.match(/SET (.*) WHERE/)[1].split(', ').map(s => s.split(' = ')[0]);
      keys.forEach((key, i) => {
        event[key] = params[i];
      });
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }
  return [];
}

// auth endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name, department, student_id, role } = req.body;
    const key = email.toLowerCase().trim();
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const existing = await query('SELECT 1 FROM users WHERE email = ?', [key]);
    if (existing.length) return res.status(400).json({ error: 'User already exists' });

    const id = crypto.randomUUID();
    await query(
      `INSERT INTO users (id, email, password, full_name, department, student_id, role)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, key, password, full_name, department, student_id, role || 'student']
    );

    const token = generateToken();
    await query('INSERT INTO sessions (token, email) VALUES (?, ?)', [token, key]);

    res.json({ user: { id, email: key, full_name, department, student_id, role: role || 'student' }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const key = email.toLowerCase().trim();
    const users = await query('SELECT * FROM users WHERE email = ?', [key]);
    const user = users[0];
    if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken();
    await query('INSERT INTO sessions (token, email) VALUES (?, ?)', [token, key]);
    delete user.password;
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) await query('DELETE FROM sessions WHERE token = ?', [token]);
    res.json({});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// events endpoints
app.get('/api/events', async (req, res) => {
  try {
    const events = await query('SELECT * FROM events');
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const ev = { ...req.body, id: crypto.randomUUID(), attendees_count: 0 };
    await query(
      `INSERT INTO events (id, title, description, date, attendees_count)
       VALUES (?, ?, ?, ?, ?)`,
      [ev.id, ev.title, ev.description, ev.date, ev.attendees_count]
    );
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const changes = req.body;
    const keys = Object.keys(changes);
    if (!keys.length) return res.status(400).json({ error: 'No changes provided' });
    const sets = keys.map(k => `${k} = ?`).join(', ');
    const params = [...keys.map(k => changes[k]), id];

    const result = await query(`UPDATE events SET ${sets} WHERE id = ?`, params);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });

    const [updated] = await query('SELECT * FROM events WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM events WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/events/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const [event] = await query('SELECT * FROM events WHERE id = ?', [id]);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    await query('UPDATE events SET attendees_count = attendees_count + 1 WHERE id = ?', [id]);
    const [updated] = await query('SELECT * FROM events WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// start server after initializing database
// initDb()
//   .then(() => {
    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
//   })
//   .catch(err => {
//     console.error('Failed to initialize database', err);
//     process.exit(1);
//   });
