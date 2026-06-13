import React from "react";
import "../styles/SearchBar.css";

const SearchBar = ({ value, onChange, onClear }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for movies..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="clear-btn" onClick={onClear} aria-label="Clear search">
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
