import React, { useState, useEffect } from 'react';

// Dark Mode Style Definitions
const styles = {
  planContainer: {
    padding: '20px',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    color: '#fff',
    backgroundColor: '#333',
  },
  categoryForm: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryInput: {
    padding: '10px',
    border: '1px solid #666',
    borderRadius: '4px',
    marginRight: '10px',
    backgroundColor: '#222',
    color: '#fff',
    flexGrow: 1,
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#5cb85c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  categoryContainer: {
    backgroundColor: '#222',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
    margin: '0 10px',
    padding: '10px',
    flexShrink: 0,
    borderRadius: '4px',
    height: '600px',
  },
  todoList: {
    listStyle: 'none',
    paddingLeft: '0',
  },
  todoItem: {
    padding: '5px 0',
    borderBottom: '1px solid #444',
  },
};

// Plan Component
const Plan = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem('categoriesData');
    if (storedData) {
      setCategories(JSON.parse(storedData));
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

  useEffect(() => {
    localStorage.setItem('categoriesData', JSON.stringify(categories));
  }, [categories]);

  return (
    <div style={styles.planContainer}>
      <AddCategoryForm addCategory={addCategory} />
      <div style={{ display: 'flex', overflowX: 'auto' }}>
        {categories.map((category, index) => (
          <Category
            key={index}
            category={category}
            addTodo={(newTodo) => addTodo(category.categoryName, newTodo)}
          />
        ))}
      </div>
    </div>
  );
};

// AddCategoryForm Component
const AddCategoryForm = ({ addCategory }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addCategory(categoryName);
    setCategoryName('');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.categoryForm}>
      <input
        type="text"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        placeholder="New Category Name"
        style={styles.categoryInput}
      />
      <button type="submit" style={styles.addButton}>Add Category</button>
    </form>
  );
};

// Category Component
const Category = ({ category, addTodo }) => {
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(newTodo);
    setNewTodo('');
  };

  return (
    <div style={styles.categoryContainer}>
      <h3>{category.categoryName}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="New Todo"
          style={styles.categoryInput}
        />
        <button type="submit" style={styles.addButton}>Add Todo</button>
      </form>
      <ul style={styles.todoList}>
        {category.todos.map((todo, index) => (
          <li key={index} style={styles.todoItem}>{todo.task}</li>
        ))}
      </ul>
    </div>
  );
};

export default Plan;
