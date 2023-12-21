import React from 'react';
import HeaderSection from './Blogs/BlogHeader';
import StatsSection from './Blogs/BlogStatsSection';
import BlogCategoryContent from './Blogs/BlogCategoryContent';
const Blogs = () => {
  return (
    <div>
      <HeaderSection />
      <StatsSection />
      <BlogCategoryContent />
    </div>
  );
};

export default Blogs;
