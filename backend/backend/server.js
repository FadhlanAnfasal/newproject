const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'todo_db'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  // Create todos table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS todos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  
  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating todos table:', err);
      return;
    }
    console.log('Todos table created or already exists');
  });
});

// API Routes

// Get all todos
app.get('/api/todos', (req, res) => {
  db.query('SELECT * FROM todos ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error fetching todos:', err);
      return res.status(500).json({ error: 'Error fetching todos' });
    }
    res.json(results);
  });
});

// Get a single todo
app.get('/api/todos/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM todos WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching todo:', err);
      return res.status(500).json({ error: 'Error fetching todo' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(results[0]);
  });
});

// Create a new todo
app.post('/api/todos', (req, res) => {
  const { title, description, status } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const query = 'INSERT INTO todos (title, description, status) VALUES (?, ?, ?)';
  db.query(query, [title, description, status || 'pending'], (err, result) => {
    if (err) {
      console.error('Error creating todo:', err);
      return res.status(500).json({ error: 'Error creating todo' });
    }
    
    const newTodoId = result.insertId;
    db.query('SELECT * FROM todos WHERE id = ?', [newTodoId], (err, results) => {
      if (err) {
        console.error('Error fetching new todo:', err);
        return res.status(500).json({ error: 'Todo created but error fetching details' });
      }
      res.status(201).json(results[0]);
    });
  });
});

// Update a todo
app.put('/api/todos/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, status } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const query = 'UPDATE todos SET title = ?, description = ?, status = ? WHERE id = ?';
  db.query(query, [title, description, status, id], (err, result) => {
    if (err) {
      console.error('Error updating todo:', err);
      return res.status(500).json({ error: 'Error updating todo' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    db.query('SELECT * FROM todos WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Error fetching updated todo:', err);
        return res.status(500).json({ error: 'Todo updated but error fetching details' });
      }
      res.json(results[0]);
    });
  });
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const id = req.params.id;
  
  db.query('DELETE FROM todos WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting todo:', err);
      return res.status(500).json({ error: 'Error deleting todo' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully', id });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});