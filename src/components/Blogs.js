import React from 'react';
import HeaderSection from './Blogs/BlogHeader';
import StatsSection from './Blogs/BlogStatsSection';
import BlogCategoryContent from './Blogs/BlogCategoryContent';


const blogContainerStyle = {
  border: '1px solid black',
  backgroundColor: 'black',
  margin: '40px',
};

const Blogs = () => {
  return (
    <div style={{ backgroundColor: 'black' }}>
      <HeaderSection />
      <div style={blogContainerStyle}>
        <StatsSection />
        <BlogCategoryContent />
      </div>
    </div>
  );
};

export default Blogs;
