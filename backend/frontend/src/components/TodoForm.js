import React, { useState, useEffect } from 'react';

const TodoForm = ({ addTodo, editingTodo, updateTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');

  // Set form fields when editing a todo
  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description || '');
      setStatus(editingTodo.status);
    }
  }, [editingTodo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    
    const todoData = {
      title,
      description,
      status
    };
    
    if (editingTodo) {
      updateTodo(editingTodo.id, todoData);
    } else {
      addTodo(todoData);
    }
    
    // Reset form
    setTitle('');
    setDescription('');
    setStatus('pending');
  };

  return (
    <div className="todo-form">
      <h2>{editingTodo ? 'Edit Todo' : 'Add New Todo'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter todo title"
          />
        </div>
        
        <div>
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter todo description"
            rows="3"
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <button type="submit" className="btn-primary">
          {editingTodo ? 'Update Todo' : 'Add Todo'}
        </button>
        
        {editingTodo && (
          <button
            type="button"
            className="btn-warning"
            onClick={() => {
              setTitle('');
              setDescription('');
              setStatus('pending');
              updateTodo(null);
            }}
            style={{ marginLeft: '10px' }}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default TodoForm;