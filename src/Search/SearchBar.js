import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './search.css';

const PLACEHOLDER = "start typing to search..."

class Search extends Component {

  constructor(props) {
    super(props);
    console.log(props.innerRef);

    this.state = {
      size: PLACEHOLDER.length,
      value: ""
    }
  }

  render() {
    return (
      <input
        className="searchbar"
        type="search"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck="false"
        size={this.state.size}
        placeholder={PLACEHOLDER}
        ref={this.props.innerRef}
        onFocus={this.props.focus}
        onBlur={this.props.blur}
        onChange={event => {
          const value = event.target.value;
          const size = PLACEHOLDER.length < value.length ? value.length : PLACEHOLDER.length;
          this.setState({ size, value });
          console.log(event.target.value)
        }}
      />
    );
  }
}

Search.propTypes = {
  focus: PropTypes.func.isRequired,
  blur: PropTypes.func.isRequired,
  innerRef: PropTypes.any.isRequired
}

export default Search;
