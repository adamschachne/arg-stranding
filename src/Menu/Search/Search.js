import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchItems from './SearchItems';
// import InfoBox from '../Info/InfoBox';

import './Search.css';

const PLACEHOLDER = "start typing to search..."

class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      size: PLACEHOLDER.length,
      value: "",
      searching: false
    }
    this.commands = [];
    this.usingEdgeOrIE = (document.documentMode || /Edge/.test(navigator.userAgent));
    // this.searching = false;
  }

  onWindowKeydown = event => {
    // console.log(event);
    if (event.keyCode < 112 || event.keyCode > 121) {
      if (event.keyCode === 27) { // Esc      
        this.closeSearch();
      } else if (event.keyCode === 9) { // Tab      
        event.preventDefault();
        this.props.searchRef.current.blur();
      } else if (event.keyCode !== 17 && event.keyCode !== 18) { // not Ctrl or Alt
        this.props.searchRef.current.focus();
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

  closeSearch = (target) => {
    // console.log(target);
    this.setState((prevState) => {
      this.props.searchRef.current.blur();
      this.props.searchRef.current.value = "";
      this.props.focusNode(target);
      return { searching: false, value: "", size: PLACEHOLDER.length };
    });
  }

  render() {
    const { value } = this.state;
    const filteredCommands = value === "" ? [] : this.commands
      .filter(cmd => cmd.indexOf(value) !== -1);

    return (
      <div className="search-component">
        {/* <InfoBox /> */}
        <input
          type="search"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          size={this.state.size}
          placeholder={this.props.loading ? "loading..." : PLACEHOLDER}
          ref={this.props.searchRef}
          onFocus={() => {
            console.log("focusing")
            this.setState({ searching: true });
          }}
          onBlur={() => {
            console.log("blurring")
          }}
          onChange={event => {
            const value = event.target.value;
            const size = PLACEHOLDER.length < value.length ? value.length : PLACEHOLDER.length;
            this.setState({ size, value });
          }}
        />
        {this.usingEdgeOrIE && <div
          className="search-message"
          style={{
            opacity: this.props.loading ? 1 : 0
          }}>
          There are some compatibility issues with Edge and IE
        </div>}

        {this.state.searching && value.length > 0 && <SearchItems
          filteredCommands={filteredCommands}
          click={this.closeSearch}
        />}
      </div>
    );
  }
}

Search.propTypes = {
  loading: PropTypes.bool,
  nodes: PropTypes.array,
  searchRef: PropTypes.object.isRequired,
  focusNode: PropTypes.func
}

export default Search;
