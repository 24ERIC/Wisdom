import React, { useState } from 'react';
import './Blogs.css';

export default function Blogs() {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const response = await fetch(`/api/search?query=${query}&tag=${tag}`);
    const data = await response.json();
    setResults(data);
  };

  const highlightText = (text, highlight, url) => {
    let highlightedText = text;
    if (highlight.trim()) {
      const regex = new RegExp(`(${highlight})`, 'gi');
      highlightedText = text.replace(regex, '<mark>$1</mark>');
    }
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="search-result-link">${highlightedText}</a>`;
  };


  return (
    <div className="search-container">
      <div className="search-bar">
        <input type="text" placeholder="Search Query" value={query} onChange={(e) => setQuery(e.target.value)} />
        <input type="text" placeholder="Tags (comma-separated)" value={tag} onChange={(e) => setTag(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>
      <table className="results-table">
        <tbody>
          {results.map(item => (
            <tr key={item.path}>
              <td dangerouslySetInnerHTML={{ __html: highlightText(item.name, query, item.path) }} />
              <td>{item.tags.filter(t => t.includes(tag)).join(', ')}</td>
            </tr>
          ))}

        </tbody>
      </table>
      <button className="blog-button"><a href="https://24eric.github.io/Wisdom/">Blog</a></button>
    </div>
  );
}
