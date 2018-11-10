import React from "react";
import PropTypes from "prop-types";
import { withStyles, createStyles } from "@material-ui/core";

const styles = createStyles({
  searchItem: {
    color: "black",
    display: "grid",
    alignItems: "center",
    padding: "4px 10px",
    cursor: "pointer",
    minHeight: 50,
    borderbottom: "1px solid rgba(51,51,51,.12)",
    "&:hover": {
      backgroundColor: "#e0e4e7"
    }
  },
  searchItems: {
    position: "absolute",
    top: 35,
    bottom: 0,
    left: 0,
    right: 0,
    width: "100vw",
    height: "calc(100vh - 35px)",
    background: "rgba(0,0,0,.5)",
    display: "inline-block",
  },
  searchResults: {
    width: 700,
    maxHeight: 700,
    background: "#fff",
    overflow: "auto",
    position: "relative",
    margin: "0 auto"
  }
});

const Item = ({ children, className }) => {
  const label = !children ? "No Results" : children;
  return (
    <div
      className={className}
      data-label={label}
    >
      {label}
    </div>
  );
};

Item.defaultProps = {
  children: null
};

Item.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.string
};

function handleClick(target, closeSearch) {
  const label = target.getAttribute("data-label");
  // this will focus the node, or remove focus (if nothing is clicked)
  closeSearch(label);
}

function handleKeyDown(event) {

}

const SearchItems = ({ filteredCommands, closeSearch, classes }) => {
  const { searchItem, searchItems, searchResults } = classes;
  return (
    <div
      role="presentation"
      onClick={event => handleClick(event.target, closeSearch)}
      className={searchItems}
      onKeyDown={handleKeyDown}
    >
      <div className={searchResults}>
        {filteredCommands.length === 0
          ? (
            <Item className={searchItem} />
          ) : filteredCommands.map(label => (
            <Item
              key={label}
              className={searchItem}
            >
              {label}
            </Item>
          ))}
      </div>
    </div>
  );
};

SearchItems.propTypes = {
  classes: PropTypes.shape({
    searchItem: PropTypes.string.isRequired,
    searchItems: PropTypes.string.isRequired,
    searchResults: PropTypes.string.isRequired,
  }).isRequired,
  closeSearch: PropTypes.func.isRequired,
  filteredCommands: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default withStyles(styles)(SearchItems);
