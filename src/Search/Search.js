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

    this.searchIsFocused = false;
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onWindowKeydown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onWindowKeydown);
  }

  onWindowKeydown = event => {
    // console.log(event);
    if (event.keyCode === 27) { // Esc      
      this.props.innerRef.current.blur();
    } else if (event.keyCode === 9) { // Tab      
      event.preventDefault();
      this.props.innerRef.current.blur();
    } else if (event.keyCode !== 17 && !this.searchIsFocused) {
      this.props.innerRef.current.focus();
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
        onFocus={() => this.searchIsFocused = true}
        onBlur={() => {
          this.searchIsFocused = false;
          this.props.innerRef.current.value = "";
        }}
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
  // focus: PropTypes.func.isRequired,
  // blur: PropTypes.func.isRequired,
  innerRef: PropTypes.any.isRequired
}

export default Search;
