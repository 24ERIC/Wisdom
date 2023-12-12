import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';



function CustomToolbar({ handleOpen }) {
    return (
        <GridToolbarContainer>
            <GridToolbar />
            <Button color="primary" onClick={handleOpen} style={{ marginLeft: 'auto' }}>
                New Blog
            </Button>
        </GridToolbarContainer>
    );
}

const NewBlog = () => {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, title: '', tags: '', content: '' });

    const [markdownOpen, setMarkdownOpen] = useState(false);
    const [currentBlogContent, setCurrentBlogContent] = useState('');

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

    const handleOpen = () => {
        setFormData({ id: null, title: '', tags: '', content: '' });
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const handleAddOrUpdateBlogPost = () => {
        const apiEndpoint = formData.id ? `/api/blogs/${formData.id}` : '/api/blogs';
        const method = formData.id ? 'put' : 'post';
        axios[method](apiEndpoint, formData)
            .then((response) => {
                if (formData.id) {
                    setRows(rows.map((row) => (row.id === formData.id ? { ...formData } : row)));
                } else {
                    setRows([...rows, { ...formData, id: response.data.id }]);
                }
                handleClose();
            })
            .catch((error) => console.error('Error adding/updating blog post:', error));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleEdit = (blog) => {
        setFormData(blog);
        setOpen(true);
    };

    const handleDelete = (id) => {
        axios.delete(`/api/blogs/${id}`)
            .then(() => {
                setRows(rows.filter((row) => row.id !== id));
            })
            .catch((error) => console.error('Error deleting blog post:', error));
    };

    const handleRead = (blog) => {
        setCurrentBlogContent(blog.content);
        setMarkdownOpen(true);
    };

    const handleMarkdownClose = () => {
        setMarkdownOpen(false);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'title', headerName: 'Title', width: 200 },
        { field: 'tags', headerName: 'Tags', width: 200 },
        { field: 'content', headerName: 'Content', flex: 1, minWidth: 300 },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton color="primary" onClick={() => handleEdit(params.row)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
                            <DeleteIcon />
                        </IconButton>
                        <IconButton color="inherit" onClick={() => handleRead(params.row)}>
                            <VisibilityIcon />
                        </IconButton>
                    </>
                );
            }
        }
    ];

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
                        value={formData.title}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="tags"
                        label="Tags"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.tags}
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
                        value={formData.content}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddOrUpdateBlogPost} color="primary">
                        {formData.id ? 'Save' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={markdownOpen} onClose={handleMarkdownClose} fullWidth maxWidth="lg">
                <DialogTitle>Blog Content</DialogTitle>
                <DialogContent>
                    <Markdown>{currentBlogContent}</Markdown>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleMarkdownClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default NewBlog;
