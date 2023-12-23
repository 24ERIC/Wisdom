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
  marginLeft: '90px',
  width: 'calc(100% - 40px)',
  maxWidth: '600px',
  position: 'absolute',
  top: '50%',
  zIndex: 1000,
  overflow: 'hidden',
};

const historyEntryStyle = {
  background: '#FFFFFF',
  padding: '8px 16px',
  margin: '5px',
  border: '2px solid #dfe1e5',
  borderRadius: '9px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
};

export default function HomeSearchHistory() {
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
