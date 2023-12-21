import BookIcon from '@mui/icons-material/Book';

import React from 'react';

// Helper Component to render each item
const CategoryItem = ({ title, count }) => (
  <div style={{ border: '1px solid #FFFFFF', padding: '10px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span>{title}</span>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ marginRight: '5px' }}>{count}</span>
      <BookIcon />
    </div>
  </div>
);

// Main Component
const BlogCategoryContent = () => {
  // Example data, replace with actual data fetching logic
  const latestCategories = [
    { title: 'User Interface', count: 440 },
    { title: 'Security', count: 343 },
    // ... other categories
  ];

  const tagCategories = [
    { title: 'Machine Learning', count: 313 },
    { title: 'Networking', count: 292 },
    // ... other categories
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
      <section style={{ marginBottom: '20px' }}>
        <h2>Find Projects By Latest</h2>
        {latestCategories.map((item, index) => (
          <CategoryItem key={index} title={item.title} count={item.count} />
        ))}
      </section>

      <section>
        <h2>Find Blogs By Tags</h2>
        {tagCategories.map((item, index) => (
          <CategoryItem key={index} title={item.title} count={item.count} />
        ))}
      </section>
    </div>
  );
};

export default BlogCategoryContent;
