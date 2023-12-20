import React, { useState, useEffect } from 'react';
import axios from 'axios';

const homeLatestBlogsStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#f8f9fa',
  padding: '20px',
  fontSize: '1rem',
  color: '#5f6368',
};

const listStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: '0 auto',
  textAlign: 'left',
  width: '100%',
  maxWidth: '400px',
  maxHeight: '700px',
  overflowY: 'scroll',
  borderRadius: '10px',
};

const listItemStyle = {
  background: 'linear-gradient(to right, #7f7fd5, #86a8e7, #91eae4)',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  padding: '15px',
  margin: '10px 0',
  transition: 'transform 0.3s ease-in-out',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const HomeLatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get('/api/latestblogs')
      .then(response => {
        setBlogs(response.data);
      })
      .catch(error => console.error('Error fetching blogs:', error));
  }, []);

  const onHover = (e, isHovering) => {
    e.currentTarget.style.transform = isHovering ? 'scale(1.05)' : 'scale(1)';
  };

  return (
    <div style={homeLatestBlogsStyle}>
      <h2>Latest Blogs</h2>
      <ol style={listStyle}>
        {blogs.map((blog, index) => (
          <li key={blog.id} style={listItemStyle}
            onMouseEnter={(e) => onHover(e, true)}
            onMouseLeave={(e) => onHover(e, false)}>
            <span>#{index + 1}</span>
            <span>
              {blog.title.length > 15 ? `${blog.title.substring(0, 15)}...` : blog.title}
            </span>
          </li>
        ))}

      </ol>
    </div>
  );
};

export default HomeLatestBlogs;