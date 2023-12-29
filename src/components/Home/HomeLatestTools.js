import React, { useState, useEffect } from 'react';
import axios from 'axios';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const homeLatestToolsStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  height: '100vh',
  padding: '20px',
  fontSize: '1rem',
  color: '#5f6368',
};

const latestToolsTextStyle = {
  fontWeight: 'bold',
  color: '#4a4a4a',
  fontSize: '1.2rem',
};
const listItemButtonStyle = {
  position: 'absolute',
  top: '100px',
  right: '10', 
  zIndex: 1000,
  padding: '20px',
  fontSize: '1rem',
  color: '#5f6368',
};

const listStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: 0,
  textAlign: 'left',
  width: '250px',
  maxHeight: '700px',
  overflowY: 'scroll',
  borderRadius: '10px',
  position: 'absolute',
  right: '10px',
  top: '170px',
};

const listItemStyle = {
  background: 'linear-gradient(to right, #91eae4, #86a8e7, #7f7fd5)',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  padding: '15px',
  margin: '10px 0',
  transition: 'transform 0.3s ease-in-out',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const HomeLatestTools = () => {
  const [tools, setTools] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get('/api/tools/latesttools')
      .then((response) => {
        setTools(response.data);
      })
      .catch((error) => console.error('Error fetching tools:', error));
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div style={homeLatestToolsStyle}>
      <ListItemButton style={listItemButtonStyle} onClick={handleClick}>
        <ListItemText primary="Latest Tools" primaryTypographyProps={{ style: latestToolsTextStyle }} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit style={{ width: '100%' }}>
        <List component="div" disablePadding style={listStyle}>
          {tools.map((tool, index) => (
            <ListItemButton key={tool.id} style={listItemStyle} sx={{ pl: 4 }}>
              <ListItemText
                primary={`${index + 1}. ${tool.name.length > 15 ? `${tool.name.substring(0, 15)}...` : tool.name}`}
              />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </div>
  );
};

export default HomeLatestTools;
