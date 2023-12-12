import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
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

function CustomToolbar({ handleOpen }) {
  return (
    <GridToolbarContainer>
      <GridToolbar />
      <Button color="primary" onClick={handleOpen}>{/* <Button variant="outlined" color="primary" onClick={handleOpen} style={{ marginLeft: 'auto' }}> */}
        New Blog
      </Button>
    </GridToolbarContainer>
  );
}

const NewBlog = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', tags: '', content: '' });

  useEffect(() => {
    axios.get('/api/blogs') // Ensure URL is correct
      .then(response => {
          if (Array.isArray(response.data)) {
              setRows(response.data);
          } else {
              console.error('Expected an array of blog posts, but received:', response.data);
          }
      })
      .catch(error => console.error('Error fetching blog posts:', error));
}, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddBlogPost = () => {
    // Backend endpoint to handle post creation
    const apiEndpoint = '/api/blogs';
    axios.post(apiEndpoint, formData)
      .then((response) => {
        setRows([...rows, { ...formData, id: response.data.id }]);
        handleClose();
      })
      .catch((error) => console.error('Error adding new blog post:', error));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        components={{
          Toolbar: props => <CustomToolbar {...props} handleOpen={handleOpen} />,
        }}
        disableSelectionOnClick
        density="comfortable"
      />
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
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
            rows={15}
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
    </div>
  );
};

export default NewBlog;
