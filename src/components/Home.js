import React from 'react';
import HomeSearch from './Home/HomeSearch';
import HomeTitle from './Home/HomeTitle';
import HomeSearchHistory from './Home/HomeSearchHistory';
import HomeLatestBlogs from './Home/HomeLatestBlogs';
import HomeLatestTools from './Home/HomeLatestTools';

function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', height: '30vh' }}>
      <div style={{ width: '40%', height: '10vh'}}>
        <HomeLatestBlogs />
      </div>

      <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <HomeTitle />
        <HomeSearch />
        <HomeSearchHistory />
      </div>

      <div style={{ width: '40%' }}>
        <HomeLatestTools />
      </div>
    </div>
  );
}

export default Home;
