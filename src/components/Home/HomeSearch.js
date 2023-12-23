import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import HomeSearchHistory from './HomeSearchHistory';
import { useHistory } from 'react-router-dom';

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
  const [searchInput, setSearchInput] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const history = useHistory();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    history.push({
      pathname: '/search',
      state: { searchInput }
    });
  };

  const handleSearchIconClick = () => {
    handleSearch();
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
      <SearchIcon style={iconStyle} onClick={handleSearchIconClick} />
      <input
        type="text"
        style={inputStyle}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        value={searchInput}
      />
      <HomeSearchHistory />
    </div>
  );
}