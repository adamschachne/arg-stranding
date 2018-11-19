import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
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

const NO_RESULTS = "No Results";

const Item = ({
  label,
  className,
  onHover,
  index,
  selected
}) => {
  const style = selected ? {
    backgroundColor: "#bfc1c1"
  } : undefined;

  return (
    <div
      className={className}
      data-index={index}
      onMouseOver={() => onHover(index)}
      onFocus={() => undefined}
      style={style}
    >
      {label}
    </div>
  );
};

Item.propTypes = {
  index: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  onHover: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired
};

const SearchItems = ({
  filteredCommands,
  classes: {
    searchItem,
    searchItems,
    searchResults,
  },
  selectItem,
  hoverItem,
  selected,
  itemsRef
}) => {
  const commands = filteredCommands.length === 0 ? [NO_RESULTS] : filteredCommands;
  return (
    <div
      role="presentation"
      onClick={selectItem}
      className={searchItems}
    >
      <div
        className={searchResults}
        ref={itemsRef}
      >
        {commands.map((label, index) => (
          <Item
            key={label}
            className={classNames(searchItem)}
            selected={index === selected}
            index={index}
            onHover={hoverItem}
            label={label}
          />
        ))}
      </div>
    </div>
  );
};

SearchItems.defaultProps = {
  selected: 0
};

SearchItems.propTypes = {
  classes: PropTypes.shape({
    searchItem: PropTypes.string.isRequired,
    searchItems: PropTypes.string.isRequired,
    searchResults: PropTypes.string.isRequired,
  }).isRequired,
  filteredCommands: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.number,
  selectItem: PropTypes.func.isRequired,
  hoverItem: PropTypes.func.isRequired,
  itemsRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ]).isRequired
};

export default withStyles(styles)(SearchItems);
