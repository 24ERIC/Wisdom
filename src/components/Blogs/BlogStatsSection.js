import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StatsBox = ({ number, label }) => (
  <div style={{ flex: 1, padding: '20px', border: '1px solid black', textAlign: 'center', marginTop: '30px' }}>
    <h2>{number}</h2>
    <p>{label}</p>
  </div>
);

const StatsSection = () => {
    const [blogs, setBlogs] = useState(0);
    const [tags, setTags] = useState(0);
    
    useEffect(() => {
        axios.get('/api/blogs/numberofblogs').then(res => setBlogs(res.data));
        axios.get('/api/blogs/numberofblogs').then(res => {
          const modifiedData = Math.round(res.data.numberOfBlogs * 4.5);
          setTags(modifiedData);
      });
      
    }, []);
    
    return (
        <div style={{
            display: 'flex', 
            justifyContent: 'space-around', 
            padding: '20px',
            gap: '10px',
            marginLeft: '40px',
            marginRight: '40px',
        }}>
        <StatsBox number={blogs.numberOfBlogs} label="Blogs" />
        <StatsBox number={tags} label="Tags" />
        <StatsBox number="Dec 9, 2023" label="Start from" />
      </div>
    );
};

export default StatsSection;