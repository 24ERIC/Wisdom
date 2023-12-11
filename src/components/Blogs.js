// import React, { useState } from 'react';

// export default function Blogs() {
//   const [query, setQuery] = useState('');
//   const [tag, setTag] = useState('');
//   const [results, setResults] = useState([]);

//   const handleSearch = async () => {
//     const response = await fetch(`/api/search?query=${query}&tag=${tag}`);
//     const data = await response.json();
//     setResults(data);
//   };

//   return (
//     <div>
//       <button><a href="https://24eric.github.io/Wisdom/">Blog</a></button>
//       <input type="text" placeholder="Search Query" value={query} onChange={(e) => setQuery(e.target.value)} />
//       <input type="text" placeholder="Tags (comma-separated)" value={tag} onChange={(e) => setTag(e.target.value)} />
//       <button onClick={handleSearch}>Search</button>
//       <ul>

//         {results.map(item => (
//           <li key={item.path}>
//             <a href={item.path} target="_blank" rel="noopener noreferrer">{item.name}</a> - Tags: {item.tags.join(', ')}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


import React, { useState } from 'react';
import './Blogs.css'; // Assuming you have a CSS file named Blogs.css

export default function Blogs() {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const response = await fetch(`/api/search?query=${query}&tag=${tag}`);
    const data = await response.json();
    setResults(data);
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input type="text" placeholder="Search Query" value={query} onChange={(e) => setQuery(e.target.value)} />
        <input type="text" placeholder="Tags (comma-separated)" value={tag} onChange={(e) => setTag(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>
      <ul className="results-list">
        {results.map(item => (
          <li key={item.path}>
            <a href={item.path} target="_blank" rel="noopener noreferrer">{item.name}</a> - Tags: {item.tags.join(', ')}
          </li>
        ))}
      </ul>
      <button className="blog-button"><a href="https://24eric.github.io/Wisdom/">Blog</a></button>
    </div>
  );
}
