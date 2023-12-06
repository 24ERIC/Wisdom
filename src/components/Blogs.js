import React from 'react';
import SearchBar from './Blogs/SearchBar';
import ContentEditBar from './Blogs/ContentEditBar';

function Blogs() {
  return (
    <>
      <SearchBar />
      <ContentEditBar />
      <div>
        <h2>Blogs</h2>
        <p>This is the Blogs page. Here you'll find blog posts and articles.</p>
      </div>
    </>
  );
}

export default Blogs;
