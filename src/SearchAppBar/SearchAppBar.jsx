import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  AppBar,
  withStyles,
  IconButton,
  Toolbar,
  Typography,
  InputBase,
  Collapse
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import MenuIcon from "@material-ui/icons/Menu";
import styles from "./styles";

class SearchAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  showToolbar = () => {
    this.setState({ show: true });
  };

  hideToolbar = () => {
    this.setState({ show: false });
  };

  render() {
    const { classes, transparent, clickMenu, sidebarOpen, isSwipeable } = this.props;
    const { show } = this.state;

    return (
      <AppBar
        className={classNames(
          classes.appBar,
          { [classes.transparentBar]: transparent },
          { [classes.appBarShift]: sidebarOpen && !isSwipeable }
        )}
        position="absolute"
      >
        {/* <Collapse in={show}> */}
        <Toolbar className={classes.fixedGutter} variant="dense">
          <IconButton
            className={classNames(
              { [classes.hide]: sidebarOpen && !isSwipeable },
              classes.allPointerEvents
            )}
            // className={classNames(classes.menuButton, open && classes.hide)}
            color="inherit"
            aria-label="Open drawer"
            onClick={clickMenu}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.grow} />
          <div className={classNames(classes.allPointerEvents, classes.search)}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
            />
          </div>
        </Toolbar>
        {/* </Collapse> */}
      </AppBar>
    );
  }
}

SearchAppBar.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
  isSwipeable: PropTypes.bool.isRequired,
  transparent: PropTypes.bool.isRequired,
  clickMenu: PropTypes.func.isRequired
};

export default withStyles(styles)(SearchAppBar);
