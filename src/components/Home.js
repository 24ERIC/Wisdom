import React from 'react';
import HomeSearch from './Home/HomeSearch';
import HomeTitle from './Home/HomeTitle';
import HomeSearchHistory from './Home/HomeSearchHistory';
import HomeLatestBlogs from './Home/HomeLatestBlogs';
import HomeLatestTools from './Home/HomeLatestTools';

const homeStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 3fr 1fr',
  height: '500vh',
  alignItems: 'center',
  justifyContent: 'center',
};

function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', height: '30vh' }}>
      <div style={{ width: '20%' }}>
        <HomeLatestBlogs />
      </div>
      <div style={{ width: '10%' }}>

      </div>
      <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <HomeTitle />
        <HomeSearch />
        <HomeSearchHistory />
      </div>
      <div style={{ width: '10%' }}>

      </div>
      <div style={{ width: '20%' }}>
        <HomeLatestTools />
      </div>
    </div>
  );
}

export default Home;
