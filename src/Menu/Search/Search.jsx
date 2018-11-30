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

function getDataIndex(target) {
  const index = parseInt(target.getAttribute("data-index"), 10);
  return Number.isNaN(index) ? -1 : index;
}

/**
 * @param {KeyboardEvent} event
 */
// eslint-disable-next-line complexity
function isPrintableKeycode(event) {
  const { keyCode: code } = event;
  if (event.ctrlKey || event.altKey) {
    return false;
  }
  return (code > 47 && code < 58) // number keys
    || code === 32 // spacebar
    || (code > 64 && code < 91) // letter keys
    || (code > 95 && code < 112) // numpad keys
    || (code > 185 && code < 193) // ;=,-./` (in order)
    || (code > 218 && code < 223); // [\]' (in order)
}

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

    // memo search filter
    this.lastValue = "";
    this.filteredMemo = [];

    this.itemsRef = React.createRef();
    this.handleKey = {
      up: () => {
        this.setState(({ selected }) => {
          const dec = selected - 1;
          const next = dec < 0 ? 0 : dec;
          return {
            selected: next
          };
        });
      },
      down: () => {
        this.setState(({ selected }) => {
          const commandsLength = this.filteredMemo.length;
          const inc = selected + 1;
          const max = commandsLength > 0 ? commandsLength - 1 : 0;
          return {
            selected: inc > max ? max : inc
          };
        });
      },
      enter: () => {
        const { selected } = this.state;
        this.closeSearch(this.filteredMemo[selected]);
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

  componentDidUpdate(prevProps, prevState) {
    const { selected } = this.state;
    if (prevState.selected !== selected) {
      const { current } = this.itemsRef;
      if (current) {
        const node = current.querySelectorAll(`*[data-index='${selected}']`)[0];
        if (node) {
          node.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
          });
        }
      }
    }
    this.rebuildSearch(prevProps);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onWindowKeydown);
  }

  rebuildSearch = (prevProps) => {
    const { commandToID, bruteForcedMap, showBruteForce } = this.props;
    if (showBruteForce !== prevProps.showBruteForce
      || prevProps.commandToID !== commandToID
      || prevProps.bruteForcedMap !== bruteForcedMap) {
      this.commandsArray = showBruteForce
        ? Object.keys(commandToID).sort()
        : Object.keys(commandToID)
          .filter(key => !bruteForcedMap[commandToID[key]])
          .sort();
      this.commandsArrayLowerCase = this.commandsArray.map(command => command.toLowerCase());
      this.lowerToUpper = this.commandsArrayLowerCase.reduce((result, item, index) => {
        result[item] = this.commandsArray[index]; // eslint-disable-line no-param-reassign
        return result;
      }, {});

      // invalidate memo
      this.lastValue = null;
      this.forceUpdate();
    }
  }

  onWindowKeydown = (event) => {
    const { keyCode } = event;
    const { searchRef: { current } } = this.props;
    const key = keycode(event);

    if (this.hasFocus === false && isPrintableKeycode(event)) {
      current.focus();
    }

    const func = this.handleKey[key];
    if (func) func(event);
  }

  clickItem = ({ target = null }) => {
    // get label from target
    const label = target ? this.filteredMemo[getDataIndex(target)] : null;
    this.closeSearch(label);
  }

  closeSearch = (label = null) => {
    const { focusNode, searchRef: { current } } = this.props;
    this.setState(() => {
      current.blur();
      current.value = "";
      focusNode(label);
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

  getFilteredCommandsMemo = (value) => {
    if (value !== this.lastValue) {
      this.lastValue = value;
      this.filteredMemo = value === "" ? [] : this.commandsArrayLowerCase
        .filter(cmd => cmd.indexOf(value.toLowerCase()) !== -1)
        .map(cmd => this.lowerToUpper[cmd]);
    }
    return this.filteredMemo;
  }

  render() {
    const {
      value,
      size,
      selected
    } = this.state;
    const {
      loading,
      searchRef,
    } = this.props;
    const filteredCommands = this.getFilteredCommandsMemo(value);

    return (
      <div className="search-component">
        <InputAdornment position="end">
          <IconButton
            aria-label="Clear"
            component={Link}
            to="/"
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
            filteredCommands={filteredCommands}
            selectItem={this.clickItem}
            hoverItem={this.hoverItem}
            itemsRef={this.itemsRef}
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
  focusNode: PropTypes.func.isRequired,
  showBruteForce: PropTypes.bool.isRequired,
  bruteForcedMap: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.bool),
    PropTypes.object
  ]).isRequired
};

export default withStyles(styles)(Search);
