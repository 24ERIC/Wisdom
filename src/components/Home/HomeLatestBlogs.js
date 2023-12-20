import React, { useState, useEffect } from 'react';
import axios from 'axios';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const homeLatestBlogsStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '100vh',
  padding: '20px',
  fontSize: '1rem',
  color: '#5f6368',
};

const latestBlogsTextStyle = {
  fontWeight: 'bold', // Make text bold
  color: '#4a4a4a', // Change text color
  fontSize: '1.2rem', // Increase font size
};

const listItemButtonStyle = {
  position: 'absolute',
  top: '100px',
  left: 10,
  zIndex: 1000,
  padding: '20px',
  fontSize: '1rem',
  color: '#5f6368',
};


const listStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: '0 auto',
  textAlign: 'left',
  width: '100%',
  maxWidth: '300px',
  maxHeight: '700px',
  overflowY: 'scroll',
  borderRadius: '10px',
  top: '70px',
  left: '-15px',
};

const listItemStyle = {
  background: 'linear-gradient(to right, #7f7fd5, #86a8e7, #91eae4)',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  padding: '15px',
  margin: '10px 0',
  transition: 'transform 0.3s ease-in-out',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const HomeLatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get('/api/latestblogs')
      .then(response => {
        setBlogs(response.data);
      })
      .catch(error => console.error('Error fetching blogs:', error));
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div style={homeLatestBlogsStyle}>
      <ListItemButton style={listItemButtonStyle} onClick={handleClick}>
        <ListItemText primary="Latest Blogs" primaryTypographyProps={{ style: latestBlogsTextStyle }} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding style={listStyle}>
          {blogs.map((blog, index) => (
            <ListItemButton key={blog.id} style={listItemStyle} sx={{ pl: 4 }}>
              <ListItemText primary={`${index + 1}. ${blog.title.length > 15 ? `${blog.title.substring(0, 15)}...` : blog.title}`} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </div>
  );
};

export default HomeLatestBlogs;