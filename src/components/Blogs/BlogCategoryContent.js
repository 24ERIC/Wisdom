import React, { useState, useEffect } from 'react';

const rowStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: '20px',
    marginTop: '20px',
    marginLeft: '30px',
    marginRight: '30px',
};

const tagStyle = {
    background: '#000000',
    color: '#fff',
    padding: '8px 16px',
    margin: '5px',
    border: '2px solid #dfe1e5',
    borderRadius: '9px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
};

const BlogTagsDisplay = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/blogs')
            .then(response => response.json())
            .then(data => {
                const extractedTags = data.map(blog => blog.tag);
                setTags(extractedTags);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching blogs:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div style={rowStyle}>
            {loading ? <p>Loading...</p> : tags.map((tag, index) => (
                <div key={index} style={tagStyle}>
                    {tag}
                </div>
            ))}
        </div>
    );
};

export default BlogTagsDisplay;
