import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, deleteTodo, editTodo }) => {
  if (todos.length === 0) {
    return (
      <div className="todo-list" style={{ padding: '20px', textAlign: 'center' }}>
        <p>No todos found. Add a new todo to get started!</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
        />
      ))}
    </div>
  );
};

export default TodoList;