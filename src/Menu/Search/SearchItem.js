import React from 'react';
import PropTypes from 'prop-types';

const SearchItem = ({ selected = false, children, click }) => {
  const label = !children ? "No Results" : children;
  return (
    <div
      className={selected ? "search-item-selected" : "search-item"}
      onClick={click}
    >
      {label}
    </div>
  );
};

SearchItem.propTypes = {
  click: PropTypes.func,
  children: PropTypes.string,
  selected: PropTypes.bool
}

export default SearchItem;
