import React from 'react';

const titleStyles = {
  fontSize: '4rem',
  fontWeight: 'bold',
  userSelect: 'none',
  pointerEvents: 'none',
  cursor: 'default',
  textAlign: 'center',
  marginTop: '100px',
};

const letterStyles = [
  { color: '#4285F4' },
  { color: '#EA4335' },
  { color: '#FBBC05' },
  { color: '#34A853' },
  { color: '#EA4335' },
  { color: '#4285F4' },
];

const HomeTitle = () => {
  const titleText = 'Wisdom'.split('').map((letter, index) => (
    <span key={index} style={{ ...letterStyles[index % letterStyles.length] }}>
      {letter}
    </span>
  ));

  return (
    <div style={titleStyles}>
      {titleText}
    </div>
  );
};

export default HomeTitle;
