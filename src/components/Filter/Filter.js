import React, { useState } from 'react';
import './Filter.css';

const Filter = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form className="filter" onSubmit={handleSubmit}>
      <input type="text" value={searchTerm} onChange={handleChange} placeholder="Search by name, price, or brand" />
      <button type="submit">Search</button>
    </form>
  );
};

export default Filter;
