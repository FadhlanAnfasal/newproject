import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);

  // Fetch todos from API
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/todos');
      setTodos(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching todos. Please try again.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Add new todo
  const addTodo = async (todo) => {
    try {
      const response = await axios.post('/api/todos', todo);
      setTodos([response.data, ...todos]);
    } catch (err) {
      setError('Error adding todo. Please try again.');
      console.error('Error adding todo:', err);
    }
  };

  // Update todo
  const updateTodo = async (id, updatedTodo) => {
    try {
      const response = await axios.put(`/api/todos/${id}`, updatedTodo);
      setTodos(todos.map(todo => todo.id === id ? response.data : todo));
      setEditingTodo(null);
    } catch (err) {
      setError('Error updating todo. Please try again.');
      console.error('Error updating todo:', err);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Error deleting todo. Please try again.');
      console.error('Error deleting todo:', err);
    }
  };

  // Set todo for editing
  const editTodo = (todo) => {
    setEditingTodo(todo);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Todo List Application</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <TodoForm 
        addTodo={addTodo} 
        editingTodo={editingTodo} 
        updateTodo={updateTodo} 
      />
      
      {loading ? (
        <p>Loading todos...</p>
      ) : (
        <TodoList 
          todos={todos} 
          deleteTodo={deleteTodo} 
          editTodo={editTodo} 
        />
      )}
    </div>
  );
}

export default App;