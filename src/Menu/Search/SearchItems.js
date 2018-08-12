import React from 'react';
import PropTypes from 'prop-types';
import SearchItem from './SearchItem';

SearchItem.propTypes = {
  click: PropTypes.func,
  children: PropTypes.string,
  selected: PropTypes.bool
}

function getTarget(target) {
  if (target.className === "search-items") {
    return null;
  } else if (target.className === "search-item") {
    return target.innerText;
  }
}

const SearchItems = ({ filteredCommands, click }) => {
  return (
    <div
      onClick={e => click(getTarget(e.target))}
      className="search-items"
    >
      <div className="search-results">
        {filteredCommands.length === 0 ?
          <SearchItem selected={false} />
          : filteredCommands.map(label => (
            <SearchItem
              key={label}
              selected={false}
            >
              {label}
            </SearchItem>
          ))}
      </div>
    </div>
  );
};

SearchItems.propTypes = {
  click: PropTypes.func,
  filteredCommands: PropTypes.array,
  // children: PropTypes.arrayOf(PropTypes.element)
}

export default SearchItems;