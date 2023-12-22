import React, { useState, useEffect } from 'react';

const historyBoxStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  padding: '10px',
  fontSize: '16px',
  backgroundColor: 'white',
  borderRadius: '24px',
  boxShadow: '0 1px 6px rgba(32,33,36,0.28)',
  margin: '0 auto',
  width: 'calc(100% - 40px)', // Adjusted for padding
  maxWidth: '600px', // Set a max-width if necessary
  position: 'absolute',
  top: '50%',
  zIndex: 1000,
  overflow: 'hidden' // In case of very long text
};

const historyEntryStyle = {
  background: '#FFFFFF',
  padding: '8px 16px',
  margin: '5px',
  border: '2px solid #dfe1e5',
  borderRadius: '9px', // Circular edges
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%' // Ensure it doesn't exceed the container width
};

export default function HomeSearchHistory() {
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the fake history data from the backend
    fetch('/api/search/history')
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
  console.log(searchHistory);

  if (loading) {
    return <div style={historyBoxStyle}>Loading...</div>;
  }

  if (searchHistory.length === 0) {
    return <div style={historyBoxStyle}>No history yet.</div>;
  }

  return (
    <div style={historyBoxStyle}>
      {searchHistory.map((entry, index) => (
        <div key={index} style={historyEntryStyle} title={entry.search_query}>
          {entry.search_query}
        </div>
      ))}
    </div>
  );
}
