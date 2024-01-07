import React from 'react';
import Page from './components/Page';

const appStyle = {
  height: '100vh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f0f0f0'
};

const App = () => {
  return (
    <div style={appStyle}>
      <Page pageId={1} /> {/* Assuming pageId 1 is the root page */}
    </div>
  );
};

export default App;
