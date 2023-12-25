import React, { useState } from 'react';

const AddTodoForm = ({ categoryName, addTodo }) => {
  const [todoText, setTodoText] = useState('');

  const handleInputChange = (e) => {
    setTodoText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (todoText.trim() !== '') {
      // Create a new todo object with a unique ID
      const newTodo = {
        id: Date.now(),
        text: todoText,
        categoryName: categoryName,
      };

      // Call the addTodo function to add the new todo
      addTodo(newTodo);

      // Clear the input field
      setTodoText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a new todo"
        value={todoText}
        onChange={handleInputChange}
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddTodoForm;
