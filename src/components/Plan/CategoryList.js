import React from 'react';
import CategoryItem from './CategoryItem';

const CategoryList = ({ categories, addTodo }) => {
  return (
    <div>
      {categories.map(category => (
        <CategoryItem key={category.categoryName} category={category} addTodo={addTodo} />
      ))}
    </div>
  );
};

export default CategoryList;
