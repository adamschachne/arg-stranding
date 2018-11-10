import React, { Component } from "react";
import PropTypes from "prop-types";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Home from "@material-ui/icons/Home";
import { Link } from "react-router-dom";
import keycode from "keycode";
import { withStyles, createStyles, Input } from "@material-ui/core";
import SearchItems from "./SearchItems";
import CompatibilityMessage from "./CompatibilityMessage";
import "./Search.css";

// import InfoBox from '../Info/InfoBox';

const styles = createStyles({

});

const PLACEHOLDER = "start typing to search...";

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: PLACEHOLDER.length,
      value: "",
      searching: false
    };
    this.commandsArray = [];
    this.commandsArrayLowerCase = [];
    this.lowerToUpper = {};
    this.usingEdgeOrIE = (document.documentMode || /Edge/.test(navigator.userAgent));
    // this.searching = false;
  }


  componentDidMount() {
    window.addEventListener("keydown", this.onWindowKeydown);
  }

  componentDidUpdate(prevProps) {
    const { commandToID } = this.props;
    if (prevProps.commandToID === commandToID) {
      return;
    }

    this.commandsArray = Object.keys(commandToID).sort();
    this.commandsArrayLowerCase = this.commandsArray.map(command => command.toLowerCase());
    this.lowerToUpper = this.commandsArrayLowerCase.reduce((result, item, index) => {
      result[item] = this.commandsArray[index]; // eslint-disable-line no-param-reassign
      return result;
    }, {});
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onWindowKeydown);
  }

  onWindowKeydown = (event) => {
    const { searchRef: { current } } = this.props;
    if (keycode(event) === "esc") {
      this.closeSearch();
    } else if (keycode(event) === "tab") {
      event.preventDefault();
      current.blur();
    } else if (keycode(event) !== "ctrl" && keycode(event) !== "alt") { // not Ctrl or Alt
      current.focus();
    }
  }

  closeSearch = (target) => {
    const { focusNode, searchRef: { current } } = this.props;
    this.setState(() => {
      current.blur();
      current.value = "";
      focusNode(target);
      return { searching: false, value: "", size: PLACEHOLDER.length };
    });
  }

  render() {
    const { value, size, searching } = this.state;
    const { loading, searchRef } = this.props;
    const filteredCommands = value === "" ? [] : this.commandsArrayLowerCase
      .filter(cmd => cmd.indexOf(value.toLowerCase()) !== -1)
      .map(cmd => this.lowerToUpper[cmd]);

    return (
      <div className="search-component">
        <InputAdornment position="end">
          <IconButton
            aria-label="Clear"
            component={Link}
            to="/dashboard"
            color="inherit"
          >
            <Home />
          </IconButton>
        </InputAdornment>
        {/* <InfoBox /> */}

        {/* <input
          type="search"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          size={size}
          placeholder={loading ? "loading..." : PLACEHOLDER}
          ref={searchRef}
          onFocus={() => {
            console.log("focusing");
            this.setState({ searching: true });
          }}
          onBlur={() => {
            console.log("blurring");
          }}
          onChange={({ target: { value: newValue } }) => {
            this.setState({
              size: PLACEHOLDER.length < newValue.length ? newValue.length : PLACEHOLDER.length,
              value: newValue
            });
          }}
        /> */}
        <Input
          type="search"
          autoComplete="off"
          placeholder={loading ? "loading..." : PLACEHOLDER}
          inputProps={{
            size,
            autoCapitalize: "off",
            spellCheck: "false",
            onFocus: () => {
              console.log("focusing");
              this.setState({ searching: true });
            },
            onBlur: () => {
              console.log("blurring");
            },
            onChange: ({ target: { value: newValue } }) => {
              this.setState({
                size: PLACEHOLDER.length < newValue.length ? newValue.length : PLACEHOLDER.length,
                value: newValue
              });
            }
          }}
          inputRef={searchRef}
        />
        <CompatibilityMessage show={this.usingEdgeOrIE} loading={loading} />
        {searching && value.length > 0 && (
          <SearchItems
            filteredCommands={filteredCommands}
            closeSearch={this.closeSearch}
          />
        )}
      </div>
    );
  }
}

Search.propTypes = {
  classes: PropTypes.shape({
    // searchItems: PropTypes.string.isRequired,
    // searchResults: PropTypes.string.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  commandToID: PropTypes.objectOf(PropTypes.number).isRequired,
  searchRef: PropTypes.shape({
    current: PropTypes.object
  }).isRequired,
  focusNode: PropTypes.func.isRequired
};

export default withStyles(styles)(Search);
