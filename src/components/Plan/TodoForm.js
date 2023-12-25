import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const TodoForm = ({ addTodo }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      addTodo(value);
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" alignItems="center">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a new todo"
          margin="normal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button type="submit" color="primary" variant="contained">
          Add
        </Button>
      </Box>
    </form>
  );
};

export default TodoForm;
