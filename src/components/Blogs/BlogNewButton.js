import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';

const BlogNewButton = () => {
  const addButtonStyle = {
    position: 'fixed',
    right: '60px',
    bottom: '60px',
    zIndex: 1000,
  };

  const handleClick = () => {
    console.log("Add new blog button clicked");
  };

  return (
    <Fab color="primary" aria-label="add" style={addButtonStyle} onClick={handleClick}>
      <AddIcon fontSize="large" />
    </Fab>
  );
};

export default BlogNewButton;
