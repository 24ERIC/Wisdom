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

const boxStyle = {
    background: '#000000',
    padding: '8px 16px',
    margin: '5px',
    border: '2px solid #dfe1e5',
    borderRadius: '9px',
    width: '17%',
    boxSizing: 'border-box'
};

const tagStyle = {
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
};


const BlogCategoryContent = () => {
    const [searchHistory, setSearchHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/tags')
            .then(response => response.json())
            .then(data => {
                setSearchHistory(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching history:', error);
                setLoading(false);
            });
    }, []);

    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };
    
    const boxes = chunkArray(searchHistory, 8);
    const rows = chunkArray(boxes, 5);

    return (
        <>
            {loading ? <p>Loading...</p> : rows.map((row, rowIndex) => (
                <div key={rowIndex} style={rowStyle}>
                    {row.map((box, boxIndex) => (
                        <div key={boxIndex} style={boxStyle}>
                            {box.map((tag, tagIndex) => (
                                <span key={tagIndex} style={tagStyle}>
                                    {tag.name} 📔
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
};

export default BlogCategoryContent;