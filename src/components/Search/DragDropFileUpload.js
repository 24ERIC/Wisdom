import { useCallback, useState } from 'react';
import { Box, Paper, Typography, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';

function DragDropFileUpload({ onFileUpload }) {
    const [dragOver, setDragOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        setDragOver(true);
    }, []);
    const removeImagePreview = (indexToRemove) => {
        setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    };


    const handleDragLeave = useCallback((event) => {
        event.preventDefault();
        setDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (event) => {
            event.preventDefault();
            setDragOver(false);
            const files = event.dataTransfer.files;
            if (files) {
                Array.from(files).forEach(file => handleFileChange(file));
            }
        },
        []
    );

    const handleFileChange = (file) => {
        setLoading(true);
        onFileUpload(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setLoading(false);
            setImagePreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
    };

    const handleChange = useCallback(
        (event) => {
            const files = event.target.files;
            if (files) {
                Array.from(files).forEach(file => handleFileChange(file));
            }
        },
        []
    );

    return (
        <Box>
            <Paper
                variant="outlined"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                    border: dragOver ? '2px dashed #000' : '2px dashed #aaa',
                    padding: 20,
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: dragOver ? '#eee' : '#fafafa',
                    position: 'relative',
                }}
            >
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={handleChange}
                />
                <label htmlFor="raised-button-file">
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <IconButton color="primary" aria-label="upload picture" component="span">
                            <CloudUploadIcon style={{ fontSize: 60 }} />
                        </IconButton>
                        <Typography>Drag and drop files here or click to select files</Typography>
                    </Box>
                </label>
                {loading && (
                    <CircularProgress
                        size={24}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                        }}
                    />
                )}
            </Paper>
            <Box
                sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    marginTop: 2,
                    padding: 1,
                    '&::-webkit-scrollbar': {
                        height: '10px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#888'
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#555'
                    }
                }}
            >
                {imagePreviews.map((image, index) => (
                    <Box key={index} position="relative">
                        <IconButton
                            onClick={() => removeImagePreview(index)}
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                color: 'white',
                                background: 'rgba(0, 0, 0, 0.6)',
                                borderRadius: '50%',
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Box
                            component="img"
                            src={image}
                            alt={`Image Preview ${index + 1}`}
                            sx={{ width: 'auto', height: 100, marginRight: 2 }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default DragDropFileUpload;
