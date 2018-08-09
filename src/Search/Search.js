import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchItem from './SearchItem';
import './search.css';

const PLACEHOLDER = "start typing to search..."

class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      size: PLACEHOLDER.length,
      value: ""
    }
    this.commands = [];
    this.searchIsFocused = false;
  }

  onWindowKeydown = event => {
    // console.log(event);
    if (event.keyCode < 112 || event.keyCode > 121) {
      if (event.keyCode === 27) { // Esc      
        this.props.searchRef.current.blur();
      } else if (event.keyCode === 9) { // Tab      
        event.preventDefault();
        this.props.searchRef.current.blur();
      } else if (event.keyCode !== 17 && event.keyCode !== 18) { // not Ctrl or Alt
        if (!this.searchIsFocused) {
          this.props.searchRef.current.focus();
        }
      }
    }
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onWindowKeydown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onWindowKeydown);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nodes === this.props.nodes) {
      return;
    }

    const commands = [];
    this.props.nodes.forEach(node => {
      node.label.split("\n").forEach(command => {
        commands.push(command);
      });
    });
    this.commands = commands.sort();
    // console.log(this.commands);

  }

  render() {
    const { value } = this.state;
    // let filteredCommands = value !== "" && this.commands
    //   .filter(cmd => cmd.indexOf(value) !== -1)
    //   .map(label => <div className="search-item" key={label}>{label}</div>);
    // let filteredCommands = [];
    let filteredCommands = ['?awdawd', "?22d2d2"]
      .map(label => (
        <SearchItem key={label} selected={false}>{label}</SearchItem>
      ));

    return (
      <div className="search-component">
        <input
          type="search"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          size={this.state.size}
          placeholder={PLACEHOLDER}
          ref={this.props.searchRef}
          onFocus={() => {
            console.log("focusing")
            this.searchIsFocused = true
          }}
          onBlur={() => {
            console.log("blurring")
            this.searchIsFocused = false;
            // this.props.searchRef.current.value = "";
            // this.setState({ value: "" });
          }}
          onChange={event => {
            const value = event.target.value;
            const size = PLACEHOLDER.length < value.length ? value.length : PLACEHOLDER.length;
            this.setState({ size, value });
          }}
        />
        <div className="search-items">
          {filteredCommands.length > 0 ? filteredCommands : "No Results"}
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  nodes: PropTypes.array,
  searchRef: PropTypes.object.isRequired
  // searchFocus: PropTypes.bool.isRequired,
  // render: PropTypes.func.isRequired
}

export default Search;
