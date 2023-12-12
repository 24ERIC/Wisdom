import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'title', headerName: 'Title', width: 200 },
  { field: 'tags', headerName: 'Tags', width: 200 },
  { field: 'content', headerName: 'Content', flex: 1, minWidth: 300 },
];

const NewBlog = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', tags: '', content: '' });

  useEffect(() => {
    axios.get('/api/blogs')
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
          Toolbar: GridToolbar, // Use the default toolbar
        }}
        disableSelectionOnClick
        density="comfortable"
      />
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Add New Blog Post</DialogTitle>
        <DialogContent>
          {/* Form fields */}
        </DialogContent>
        <DialogActions>
          {/* Dialog actions */}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewBlog;
