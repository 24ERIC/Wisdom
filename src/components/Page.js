
import Block from './Block';
import React, { useState, useEffect } from 'react'; // Import React and useState, useEffect from the 'react' package
import axios from 'axios';
const pageStyle = {
  maxWidth: '800px',
  margin: '20px auto',
  padding: '20px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '4px'
};

const Page = ({ pageId }) => {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    axios.get('/blocks')
      .then(response => setBlocks(response.data))
      .catch(error => console.error(error));
  }, []);


  return (
    <div style={pageStyle}>
      {blocks.map(block => <Block key={block.id} blockData={block} />)}
    </div>
  );
};

export default Page;
