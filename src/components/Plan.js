import React, { useState, useEffect } from 'react';
import CategoryList from './Plan/CategoryList';
import AddCategoryForm from './Plan/AddCategoryForm';
import data from './Plan/data.json';

function Plan() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Load data from localStorage if available
    const storedData = localStorage.getItem('categoriesData');
    if (storedData) {
      setCategories(JSON.parse(storedData));
    } else {
      // Otherwise, initialize with data from data.json
      setCategories(data);
    }
  }, []);

  const addCategory = (newCategoryName) => {
    setCategories([...categories, { categoryName: newCategoryName, todos: [] }]);
  };

  const addTodo = (categoryName, newTodo) => {
    setCategories(categories.map(category => {
      if (category.categoryName === categoryName) {
        return {
          ...category,
          todos: [...category.todos, { id: category.todos.length + 1, task: newTodo, completed: false }]
        };
      }
      return category;
    }));
  };

  // Update localStorage whenever categories change
  useEffect(() => {
    localStorage.setItem('categoriesData', JSON.stringify(categories));
  }, [categories]);

  return (
    <div>
      <AddCategoryForm addCategory={addCategory} />
      <CategoryList categories={categories} addTodo={addTodo} />
    </div>
  );
}

export default Plan;
