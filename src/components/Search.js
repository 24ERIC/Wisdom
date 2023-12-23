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
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { Divider } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

const uploadImage = async (file) => {
    // Implement image upload logic here
    // Return the URL of the uploaded image
};

const Search = () => {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, title: '', tags: '', content: '' });
    const [markdownOpen, setMarkdownOpen] = useState(false);
    const [currentBlogContent, setCurrentBlogContent] = useState('');
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const location = useLocation();
    const initialSearch = location.state?.searchInput || '';
    const [searchInput, setSearchInput] = useState(initialSearch);
    const [immediateSearchInput, setImmediateSearchInput] = useState('');
    const [markdownText, setMarkdownText] = useState('');
    const [zoomLevel, setZoomLevel] = useState(0.7); // Default zoom level is 1


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
        setSearchInput(initialSearch);
        setImmediateSearchInput(initialSearch);
    }, [location]);

    const debouncedSearch = useCallback(_.debounce((input) => {
        setSearchInput(input);
    }, 300), []);

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);
    const handleSearchInputChange = (event) => {
        const inputValue = event.target.value;
        setImmediateSearchInput(inputValue);
        debouncedSearch(inputValue);
    };

    const getFilteredRows = () => {
        if (!searchInput) return rows;

        return rows.filter(row => {
            return row.title.toLowerCase().includes(searchInput.toLowerCase()) ||
                row.content.toLowerCase().includes(searchInput.toLowerCase());
        });
    };

    const filteredRows = getFilteredRows();

    const handleOpen = (blog) => {
        setFormData(blog || { id: null, title: '', tag: '', content: '' });
        setMarkdownText(blog ? blog.content : '');
        setOpen(true);
    };

    const handleMarkdownChange = (event) => {
        const newContent = event.target.value;
        setMarkdownText(newContent);
        setFormData({ ...formData, content: event.target.value });
    };

    const handleClose = () => setOpen(false);

    const handleAddOrUpdateBlogPost = async () => {
        console.log('FormData before sending:', formData);
        if (!formData.title || !formData.content) {
            alert("Title and content are required.");
            return;
        }
        const apiEndpoint = formData.id ? `/api/blogs/${formData.id}` : '/api/blogs';
        try {
            let response;
            if (formData.id) {
                response = await axios.put(apiEndpoint, formData);
            } else {
                response = await axios.post(apiEndpoint, formData);
            }
            fetchData();
            handleClose();
        } catch (error) {
            console.error('Error adding/updating blog post:', error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/blogs');
            setRows(response.data);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleEdit = (blog) => {
        setFormData(blog);
        setMarkdownText(blog.content);
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
        { field: 'tag', headerName: 'Tag', width: 300 },
        { field: 'number_of_views', headerName: 'Views', width: 120 },
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

    ];

    return (
        <div style={{ height: 5000, width: '100%', backgroundColor: '#000000' }}>
            <TextField
                value={immediateSearchInput}
                onChange={handleSearchInputChange}
                placeholder="Search blogs..."
                style={{
                    marginBottom: '20px',
                    marginLeft: '20%',
                    marginTop: '5px',
                    width: '60%',
                    borderRadius: '40px',
                    backgroundColor: '#fff',
                    color: '#000',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                    padding: '5px 10px',
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon style={{ color: '#000' }} />
                        </InputAdornment>
                    ),
                    style: {
                        borderRadius: '40px',
                        color: '#000',
                    },
                }}
            />

            <DataGrid
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'id', sort: 'desc' }],
                    },
                }}
                rows={filteredRows}
                slots={{ toolbar: GridToolbar }}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                disableCheckboxSelection
                disableSelectionOnClick
                disableRowSelectionOnClick
                density="standard"
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                    },
                }}
            />
            <Dialog open={open} onClose={handleClose} fullScreen={true} fullWidth={true} maxWidth="lg">
                <DialogTitle>{formData.id ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                        <div style={{ flex: 1, padding: '10px' }}>
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
                                name="tag"
                                label="Tag"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.tag}
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
                                value={markdownText}
                                onChange={handleMarkdownChange}
                            />
                        </div>
                        <Divider orientation="vertical" flexItem />
                        <div style={{
                            width: '50%',
                            padding: '10px',
                            overflowY: 'auto',
                        }}>
                            <div style={{
                                transform: `scale(${zoomLevel})`,
                                transformOrigin: 'top left',
                            }}>
                                <Markdown>{markdownText}</Markdown>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>

                    <Button onClick={() => setZoomLevel(zoomLevel * 1.1)} color="primary"> <ZoomInIcon /> </Button>
                    <Button onClick={() => setZoomLevel(Math.max(zoomLevel / 1.1, 0.3))} color="primary"> <ZoomOutIcon /> </Button>
                    <Button onClick={() => setZoomLevel(0.7)} color="primary"> Reset </Button>

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