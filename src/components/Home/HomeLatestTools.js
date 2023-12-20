import React, { useState, useEffect } from 'react';
import axios from 'axios';

const homeLatestToolsStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#f8f9fa',
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
  maxWidth: '400px',
  maxHeight: '700px',
  overflowY: 'scroll',
  borderRadius: '10px',
};


const listItemStyle = {
  background: 'linear-gradient(to right, #91eae4, #86a8e7, #7f7fd5)',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  padding: '15px',
  margin: '10px 0',
  transition: 'transform 0.3s ease-in-out',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const HomeLatestTools = () => {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    axios.get('/api/latesttools')
      .then(response => {
        setTools(response.data);
      })
      .catch(error => console.error('Error fetching tools:', error));
  }, []);

  const onHover = (e, isHovering) => {
    e.currentTarget.style.transform = isHovering ? 'scale(1.05)' : 'scale(1)';
  };

  return (
    <div style={homeLatestToolsStyle}>
      <h2>Latest Tools</h2>
      <ol style={listStyle}>
        {tools.map((tool, index) => (
          <li key={tool.id} style={listItemStyle}
            onMouseEnter={(e) => onHover(e, true)}
            onMouseLeave={(e) => onHover(e, false)}>
            <span>
              {tool.name.length > 15 ? `${tool.name.substring(0, 15)}...` : tool.name}
            </span>
            <span>#{index + 1}</span>
          </li>
        ))}

      </ol>
    </div>
  );
};

export default HomeLatestTools;