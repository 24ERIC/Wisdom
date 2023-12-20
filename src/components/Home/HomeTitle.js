import React from 'react';

const titleStyles = {
  fontSize: '4rem',
  fontWeight: 'bold',
  userSelect: 'none', // Prevent text selection
  pointerEvents: 'none', // Disable pointer events on the entire title
  cursor: 'default', // Set the cursor to default
};

const letterStyles = [
  { color: '#4285F4' }, // blue
  { color: '#EA4335' }, // red
  { color: '#FBBC05' }, // yellow
  { color: '#34A853' }, // green
  { color: '#EA4335' }, // red
  { color: '#4285F4' }, // blue
];

const HomeTitle = () => {
  const titleText = 'Wisdom'.split('').map((letter, index) => (
    <span key={index} style={{ ...letterStyles[index % letterStyles.length] }}>
      {letter}
    </span>
  ));

  return <div style={titleStyles}>{titleText}</div>;
};

export default HomeTitle;
