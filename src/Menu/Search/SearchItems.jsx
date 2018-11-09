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
    display: "inline-block"
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

const Item = ({ children, click, className }) => {
  const label = !children ? "No Results" : children;
  /* eslint-disable */
  return (
    <div
      className={className}
      onClick={click}
    >
      {label}
    </div>
  );
  /* eslint-enable */
};

Item.defaultProps = {
  click: null,
  children: null
};

Item.propTypes = {
  className: PropTypes.string.isRequired,
  click: PropTypes.func,
  children: PropTypes.string
};

const SearchItems = ({ filteredCommands, click, classes }) => {
  const { searchItem, searchItems, searchResults } = classes;
  return (
    /* eslint-disable */
    <div className={searchItems}>
      <div className={searchResults}>
        {filteredCommands.length === 0
          ? (
            <Item className={searchItem} />
          ) : filteredCommands.map(label => (
            <Item
              key={label}
              className={searchItem}
              click={() => { click(label); }}
            >
              {label}
            </Item>
          ))}
      </div>
    </div>
    /* eslint-enable */
  );
};

SearchItems.propTypes = {
  classes: PropTypes.shape({
    searchItem: PropTypes.string.isRequired,
    searchItems: PropTypes.string.isRequired,
    searchResults: PropTypes.string.isRequired,
  }).isRequired,
  click: PropTypes.func.isRequired,
  filteredCommands: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default withStyles(styles)(SearchItems);
