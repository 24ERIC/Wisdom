import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import HomeSearchHistory from './HomeSearchHistory';

const searchBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px 20px',
  fontSize: '16px',
  height: '30px',
  width: '36%',
  minWidth: '300px',
  border: '1px solid #dfe1e5',
  borderRadius: '24px',
  margin: '30px 0',
  transition: 'background-color 0.3s',
};

const iconStyle = {
  marginRight: '10px',
  border: 'none',
  backgroundColor: 'transparent',
};

const inputStyle = {
  border: 'none',
  outline: 'none',
  flexGrow: 1,
  backgroundColor: 'transparent',
};


export default function HomeSearch() {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const backgroundColor = isHovered ? '#f0f0f0' : 'white';

  return (
    <div
      style={{
        ...searchBoxStyle,
        backgroundColor,
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SearchIcon style={iconStyle} />
      <input type="text" style={inputStyle} />
      <HomeSearchHistory />
    </div>
  );
}


