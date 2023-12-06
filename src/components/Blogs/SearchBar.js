import SearchIcon from '@mui/icons-material/Search';
import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Box, InputBase, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export default function SearchBar() {
    const [open, setOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (event) => {
        event.preventDefault();
        const searchQuery = event.target.elements.searchInput.value;
        fetchSearchResults(searchQuery);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchSearchResults = async (searchQuery) => {
        console.log(searchQuery)
        try {
            const response = await fetch('http://localhost:5000/api/blog/searchResult', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                console.log("helloooooooooooo")
                console.log(response)
                console.log("helloooooooooooo")
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Fetching search results failed:', error);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', margin: 2 }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
                <Search sx={{ width: { sm: '50%', md: '40%' }, margin: 'auto' }}> 
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        name="searchInput"
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </Search>
                <Button type="submit" variant="contained" sx={{ marginLeft: 2 }}>Search</Button>
            </form>

            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Search Results</DialogTitle>
                <DialogContent dividers>
                    {searchResults.map((result, index) => (
                        <Box key={index} sx={{ marginBottom: 2 }}>
                            <Typography variant="h6">{result.title} -- {result.date}</Typography>
                            <Typography variant="body2" color="textSecondary">{result.tags.join(', ')}</Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                {result.content.split('\n').slice(0, 4).join('\n')}
                            </Typography>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}