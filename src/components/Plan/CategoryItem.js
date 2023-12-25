import React from 'react';
import TodoList from './TodoList';
import AddTodoForm from './AddTodoForm';

const CategoryItem = ({ category, addTodo }) => {
  return (
    <div>
      <h3>{category.categoryName}</h3>
      <AddTodoForm categoryName={category.categoryName} addTodo={addTodo} />
      <TodoList todos={category.todos} />
    </div>
  );
};

export default CategoryItem;
