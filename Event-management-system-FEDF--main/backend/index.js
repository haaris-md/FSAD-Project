// simple backend for the event system using MySQL
require('dotenv').config();                       // load .env if present
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// database connection pool
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'eventdb',
  waitForConnections: true,
  connectionLimit: 10,
};

let pool;

async function initDb() {
  // try to create the database if it doesn't already exist
  const { host, user, password, database } = dbConfig;
  const basePool = await mysql.createPool({ host, user, password });
  await basePool.execute(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
  await basePool.end();

  pool = mysql.createPool(dbConfig);

  // create tables if they don't exist
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      full_name VARCHAR(255),
      department VARCHAR(255),
      student_id VARCHAR(50),
      role VARCHAR(50) DEFAULT 'student'
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      token VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS events (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      date DATETIME,
      attendees_count INT DEFAULT 0
    )
  `);

  // optionally seed the database with some sample data
  await seedData();
}

// insert default users/events if tables are empty
async function seedData() {
  const usersCount = await query('SELECT COUNT(*) as cnt FROM users');
  if (usersCount[0].cnt === 0) {
    console.log('Seeding default users');
    const defaultUsers = [
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
    for (const u of defaultUsers) {
      await query(
        `INSERT INTO users (id, email, password, full_name, department, student_id, role)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [u.id, u.email, u.password, u.full_name, u.department, u.student_id, u.role]
      );
    }
  }

  const eventsCount = await query('SELECT COUNT(*) as cnt FROM events');
  if (eventsCount[0].cnt === 0) {
    console.log('Seeding default events');
    const defaultEvents = [
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
    for (const e of defaultEvents) {
      await query(
        `INSERT INTO events (id, title, description, date, attendees_count)
         VALUES (?, ?, ?, ?, ?)`,
        [e.id, e.title, e.description, e.date, e.attendees_count]
      );
    }
  }
}

function generateToken() {
  return crypto.randomUUID();
}

// helper for queries
async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows;
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
initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database', err);
    process.exit(1);
  });
