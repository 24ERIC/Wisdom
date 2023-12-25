import React, { useState } from 'react';

const AddCategoryForm = ({ addCategory }) => {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleInputChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCategoryName.trim() !== '') {
      // Call the addCategory function to add the new category
      addCategory(newCategoryName);

      // Clear the input field
      setNewCategoryName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter a new category name"
        value={newCategoryName}
        onChange={handleInputChange}
      />
      <button type="submit">Add Category</button>
    </form>
  );
};

export default AddCategoryForm;
