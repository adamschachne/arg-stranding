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
      selected: 0
    };
    this.hasFocus = false;
    this.commandsArray = [];
    this.commandsArrayLowerCase = [];
    this.lowerToUpper = {};
    this.usingEdgeOrIE = (document.documentMode || /Edge/.test(navigator.userAgent));
    this.filteredCommands = [];

    this.handleKey = {
      up: () => {
        this.setState(({ selected }) => {
          const dec = selected - 1;
          return {
            selected: dec < 0 ? 0 : dec
          };
        });
      },
      down: () => {
        this.setState(({ selected }) => {
          const commandsLength = this.filteredCommands.length;
          const inc = selected + 1;
          const max = commandsLength > 0 ? commandsLength - 1 : 0;
          return {
            selected: inc > max ? max : inc
          };
        });
      },
      enter: () => {
        const { selected } = this.state;
        this.closeSearch(this.filteredCommands[selected]);
      },
      esc: () => {
        this.closeSearch();
      },
      tab: (event) => {
        const { searchRef: { current } } = this.props;
        event.preventDefault();
        current.blur();
      }
    };
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
    const { keyCode } = event;
    const { searchRef: { current } } = this.props;
    const key = keycode(event);

    if (this.hasFocus === false) {
      const lower = keycode("0");
      const upper = keycode("z");
      if (keyCode >= lower && keyCode <= upper) {
        current.focus();
      }
    }

    const func = this.handleKey[key];
    if (func) func(event);
  }

  closeSearch = (target = null) => {
    const { focusNode, searchRef: { current } } = this.props;
    this.setState(() => {
      current.blur();
      current.value = "";
      focusNode(target);
      return {
        selected: 0,
        value: "",
        size: PLACEHOLDER.length
      };
    });
  }

  hoverItem = (index) => {
    // console.log(index);
    this.setState({ selected: index });
  }

  render() {
    const {
      value,
      size,
      selected
    } = this.state;
    const { loading, searchRef } = this.props;
    this.filteredCommands = value === "" ? [] : this.commandsArrayLowerCase
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
        <Input
          type="search"
          fullWidth
          autoComplete="off"
          placeholder={loading ? "loading..." : PLACEHOLDER}
          inputProps={{
            size,
            autoCapitalize: "off",
            spellCheck: "false",
            onFocus: () => { this.hasFocus = true; },
            onBlur: () => { this.hasFocus = false; },
            onChange: ({ target: { value: newValue } }) => {
              // TODO use old selected value
              this.setState(oldState => ({
                size: PLACEHOLDER.length < newValue.length ? newValue.length : PLACEHOLDER.length,
                value: newValue,
                selected: 0
              }));
            }
          }}
          inputRef={searchRef}
        />
        <CompatibilityMessage show={this.usingEdgeOrIE} loading={loading} />
        {value.length > 0 && (
          <SearchItems
            selected={selected}
            filteredCommands={this.filteredCommands}
            selectItem={this.closeSearch}
            hoverItem={this.hoverItem}
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
