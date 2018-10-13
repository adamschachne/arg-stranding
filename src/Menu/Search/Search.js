import React, { Component } from "react";
import PropTypes from "prop-types";
import SearchItems from "./SearchItems";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Home from "@material-ui/icons/Home";
import { Link } from "react-router-dom";
import keycode from "keycode";
// import InfoBox from '../Info/InfoBox';

import "./Search.css";

const PLACEHOLDER = "start typing to search..."

class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      size: PLACEHOLDER.length,
      value: "",
      searching: false
    }
    this.commandsArray = [];
    this.commandsArrayLowerCase = [];
    this.lowerToUpper = {};
    this.usingEdgeOrIE = (document.documentMode || /Edge/.test(navigator.userAgent));
    // this.searching = false;
  }

  // eslint-disable-next-line
  onWindowKeydown = event => {
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
    if (prevProps.commandToID === this.props.commandToID) {
      return;
    }

    this.commandsArray = Object.keys(this.props.commandToID).sort();
    this.commandsArrayLowerCase = this.commandsArray.map(command => command.toLowerCase());
    this.lowerToUpper = this.commandsArrayLowerCase.reduce((result, item, index) => {
      result[item] = this.commandsArray[index];
      return result;
    }, {});
  }

  closeSearch = (target) => {
    // console.log(target);
    this.setState(() => {
      this.props.searchRef.current.blur();
      this.props.searchRef.current.value = "";
      this.props.focusNode(target);
      return { searching: false, value: "", size: PLACEHOLDER.length };
    });
  }

  // eslint-disable-next-line
  render() {
    const { value } = this.state;
    const filteredCommands = value === "" ? [] : this.commandsArrayLowerCase
      .filter(cmd => cmd.indexOf(value.toLowerCase()) !== -1)
      .map(cmd => this.lowerToUpper[cmd]);

    return (
      <div className="search-component">
        <InputAdornment position="end">
          <IconButton
            aria-label="Clear"
            component={Link} to="/dashboard"
            color="inherit"
          >
            <Home />
          </IconButton>
        </InputAdornment>
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
  commandToID: PropTypes.object,
  searchRef: PropTypes.object.isRequired,
  focusNode: PropTypes.func
}

export default Search;
