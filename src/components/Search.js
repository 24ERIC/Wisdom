import React, { useState, useEffect, useCallback } from 'react';
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
import { useLocation } from 'react-router-dom';
import _ from 'lodash';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';


const Search = () => {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, title: '', tags: '', content: '' });
    const [markdownOpen, setMarkdownOpen] = useState(false);
    const [currentBlogContent, setCurrentBlogContent] = useState('');
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const location = useLocation();
    const [searchInput, setSearchInput] = useState('');

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

    useEffect(() => {
        if (location.state?.searchInput) {
            console.log(location.state.searchInput);
            setSearchInput(location.state.searchInput);
        } else {
            console.log("");
            setSearchInput('');
        }
    }, [location]);

    const debouncedSearch = useCallback(_.debounce((input) => {
        setSearchInput(input);
    }, 300), []);

    const handleSearchInputChange = (event) => {
        debouncedSearch(event.target.value);
    };

    const getFilteredRows = () => {
        if (!searchInput) return rows;

        return rows.filter(row => {
            return row.title.toLowerCase().includes(searchInput.toLowerCase()) ||
                row.content.toLowerCase().includes(searchInput.toLowerCase());
        });
    };

    const filteredRows = getFilteredRows();

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

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setConfirmDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId !== null) {
            axios.delete(`/api/blogs/${deleteId}`)
                .then(() => {
                    setRows(rows.filter((row) => row.id !== deleteId));
                    setConfirmDeleteOpen(false);
                })
                .catch((error) => console.error('Error deleting blog post:', error));
        }
    };

    const handleCancelDelete = () => {
        setConfirmDeleteOpen(false);
    };

    const handleRead = (blog) => {
        setCurrentBlogContent(blog.content);
        setMarkdownOpen(true);
    };

    const handleMarkdownClose = () => {
        setMarkdownOpen(false);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'title', headerName: 'Title', width: 400 },
        { field: 'content', headerName: 'Content', width: 400 },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton color="primary" onClick={() => handleEdit(params.row)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => handleDeleteClick(params.row.id)}>
                            <DeleteIcon />
                        </IconButton>
                        <IconButton color="inherit" onClick={() => handleRead(params.row)}>
                            <VisibilityIcon />
                        </IconButton>
                    </>
                );
            }
        },
        { field: 'tags', headerName: 'Tags', width: 300 },

    ];

    return (
        <div style={{ height: 500, width: '100%' }}>
            <TextField
                onChange={handleSearchInputChange}
                placeholder="Search..."
                style={{ marginBottom: '0px' }}
            />
            <DataGrid
                rows={filteredRows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                disableCheckboxSelection
                disableSelectionOnClick
                disableRowSelectionOnClick
                density="standard"
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
            <Dialog open={confirmDeleteOpen} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this blog post?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Fab color="primary" aria-label="add" style={{
                position: 'fixed',
                right: '60px',
                bottom: '60px',
                zIndex: 1000,
            }}
                onClick={handleOpen}>
                <AddIcon fontSize="large" />
            </Fab>
        </div>
    );
};

export default Search;