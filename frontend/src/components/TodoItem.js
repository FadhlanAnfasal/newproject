import React from 'react';

const TodoItem = ({ todo, deleteTodo, editTodo }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'in_progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="todo-item">
      <div className="todo-info">
        <h3 className="todo-title">{todo.title}</h3>
        {todo.description && <p className="todo-description">{todo.description}</p>}
        <div>
          <small>Created: {formatDate(todo.created_at)}</small>
        </div>
      </div>
      
      <div className="todo-meta">
        <span className={`todo-status ${getStatusClass(todo.status)}`}>
          {todo.status.replace('_', ' ').toUpperCase()}
        </span>
        
        <div className="todo-actions">
          <button 
            className="btn-warning" 
            onClick={() => editTodo(todo)}
          >
            Edit
          </button>
          <button 
            className="btn-danger" 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this todo?')) {
                deleteTodo(todo.id);
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;