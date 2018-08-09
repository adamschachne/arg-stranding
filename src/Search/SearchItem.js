import React, { Component } from 'react';
import PropTypes from 'prop-types';

const SearchItem = ({ selected, children, click }) => (
  <div 
    className={selected ? "search-item-selected" : "search-item"}
    onClick={click}
  >

    {children}
  </div>
);

SearchItem.propTypes = {
  click: PropTypes.func,
  children: PropTypes.string.isRequired,
  selected: PropTypes.boolean
}

export default SearchItem;
