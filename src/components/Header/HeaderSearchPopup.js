



import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';

export default function HeaderSearchPopup({ open, handleClose }) {
    const [searchHistory, setSearchHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open) {
            fetch('/api/search/history')
                .then(response => response.json())
                .then(data => {
                    setSearchHistory(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching history:', error);
                    setLoading(false);
                });
        }
    }, [open]);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        bgcolor: 'background.paper',
        border: '1px solid #000',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column'
    };

    const listStyle = {
        width: '100%',
        maxHeight: '400px',
        overflowY: 'auto'
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="search-history-title"
            aria-describedby="search-history-description"
        >
            <Box sx={style}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search..."
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 'normal' }}>
                    Recent
                </Typography>
                {loading ? <p>Loading...</p> : (
                    <List sx={listStyle}>
                        {searchHistory.map((history, index) => (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <ListItemIcon>
                                        <HistoryIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={history.query} />
                                </ListItem>
                                <hr />
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Box>
        </Modal>
    );
}
