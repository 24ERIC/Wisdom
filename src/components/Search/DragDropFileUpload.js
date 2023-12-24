import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const DragDropFileUpload = ({ currentPostId, onFileUpload, onMarkdownGenerated }) => {
    console.log("currentPostId in DragDropFileUpload:", currentPostId);
    const [dragOver, setDragOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [fileCount, setFileCount] = useState(0);
    const [timeStamp, setTimeStamp] = useState("");

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        setDragOver(true);
    }, []);
    const removeImagePreview = (indexToRemove) => {
        setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleFileChange = (file) => {
        setLoading(true);
        const timestamp = Date.now();
        setTimeStamp(timestamp);
        const extension = file.name.substring(file.name.lastIndexOf('.'));
        const newFileName = `${timestamp}${extension}`;
    
        const newFile = new File([file], newFileName, { type: file.type });
        const formData = new FormData();
        formData.append('file', newFile);
    
        axios.post(`/api/imageupload/${currentPostId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLoading(false);
                setImagePreviews(prev => [...prev, { url: reader.result, name: newFileName }]);
            };
            reader.readAsDataURL(file);
        }).catch(error => {
            console.error("Error uploading file:", error);
            setLoading(false);
        });
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

    const generateMarkdownText = () => {
        return imagePreviews.map((preview, index) => {
            const extension = preview.name.substring(preview.name.lastIndexOf('.'));
            const newFileName = `${timeStamp}${extension}`;
            return `![](/blog_image/${currentPostId}/${newFileName})`;
        }).join('\n');
    };
    
    useEffect(() => {
        if (imagePreviews.length > 0) {
            const markdownText = generateMarkdownText();
            console.log('Calling onMarkdownGenerated with:', markdownText);
            onMarkdownGenerated(markdownText);
        }
    }, [imagePreviews, onMarkdownGenerated]);

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
                            src={image.url}
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
