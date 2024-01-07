import React from 'react';

const textStyle = {
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '10px 0'
};

const headerStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '20px 0 10px'
};

const Block = ({ blockData }) => {
  // Render different types of blocks based on blockData.Type
  if (blockData.Type === 'text') {
    return <p style={textStyle}>{blockData.Content}</p>;
  }

  if (blockData.Type === 'header1') {
    return <h1 style={headerStyle}>{blockData.Content}</h1>;
  }

  // Add more conditions for other types

  return <div>Unsupported Block Type</div>;
};

export default Block;
