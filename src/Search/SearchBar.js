import React, { Component } from 'react';

import './searchbar.css';

class SearchBar extends Component {

  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <input
        className="searchbar"
        type="text"
        placeholder="start typing to search..."
      />
    );
  }
}

export default SearchBar;
