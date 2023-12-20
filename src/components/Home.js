import React from 'react';
import HomeSearch from './Home/HomeSearch';
import HomeTitle from './Home/HomeTitle';

const centerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '50vh',
};

function Home() {
  
  return (
    <div style={centerContainerStyle}>
      <HomeTitle />
      <HomeSearch />
    </div>
  );
}

export default Home;
