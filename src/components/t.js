import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'title', headerName: 'Title', width: 200 },
  { field: 'tags', headerName: 'Tags', width: 200 },
  { field: 'content', headerName: 'Content', flex: 1, minWidth: 300 },
];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
      <GridToolbar />
    </GridToolbarContainer>
  );
}

const NewBlog = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', tags: '', content: '' });

  useEffect(() => {
    // Replace with the correct endpoint for fetching blog posts
    axios.get('/api/blogs')
      .then(response => setRows(response.data))
      .catch(error => console.error('Error fetching blog posts:', error));
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddBlogPost = () => {
    // Replace with the correct endpoint for adding a new blog post
    axios.post('/api/blogs', formData)
      .then(response => {
        setRows([...rows, response.data]); // Add the new blog post to the grid
        handleClose();
      })
      .catch(error => console.error('Error adding new blog post:', error));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div style={{ height: 600, width: '100%' }}>
      <Button variant="outlined" color="primary" onClick={handleOpen}>
        Add New Blog
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Blog Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="tags"
            label="Tags"
            type="text"
            fullWidth
            variant="outlined"
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="content"
            label="Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddBlogPost} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        components={{
          Toolbar: CustomToolbar,
        }}
        disableSelectionOnClick
        density="comfortable"
      />
    </div>
  );
};

export default NewBlog;