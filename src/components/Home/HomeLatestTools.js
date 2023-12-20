import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomeLatestTools = () => {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    axios.get('/latest-tools')
      .then(response => {
        setTools(response.data);
      })
      .catch(error => console.error('Error fetching tools:', error));
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <h2>Latest Tools</h2>
      <ul>
        {tools.map(tool => (
          <li key={tool.id}>{tool.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomeLatestTools;
