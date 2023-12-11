import React, { useState } from 'react';

export default function Tools() {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const response = await fetch(`/api/search?query=${query}&tag=${tag}`);
    const data = await response.json();
    setResults(data);
  };

  return (
    <div>
      <input type="text" placeholder="Search Query" value={query} onChange={(e) => setQuery(e.target.value)} />
      <input type="text" placeholder="Tags (comma-separated)" value={tag} onChange={(e) => setTag(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <ul>

        {results.map(item => (
          <li key={item.path}>
            <a href={item.path} target="_blank" rel="noopener noreferrer">{item.name}</a> - Tags: {item.tags.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}
