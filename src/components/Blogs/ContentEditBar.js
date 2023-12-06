import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';



export default function ContentEditBar() {
    return (
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit">New Content</Button>
          <Button color="inherit">Edit</Button>
          <Button color="inherit">Save</Button>
          <Button color="inherit">Delete</Button>
        </Toolbar>
      </AppBar>
    );
  }