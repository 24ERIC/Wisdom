import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomeLatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get('/latest-blogs')
      .then(response => {
        setBlogs(response.data);
      })
      .catch(error => console.error('Error fetching blogs:', error));
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <h2>Latest Blogs</h2>
      <ul>
        {blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomeLatestBlogs;
