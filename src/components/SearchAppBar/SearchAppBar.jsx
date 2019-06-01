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

class SearchAppBar extends React.PureComponent {
  render() {
    const { classes, transparent, clickMenu, sidebarOpen } = this.props;

    return (
      <AppBar
        className={classNames(classes.appBar, { [classes.transparentBar]: transparent })}
        position="absolute"
      >
        <Toolbar className={classes.fixedGutter} variant="dense">
          <IconButton
            className={classNames(classes.allPointerEvents)}
            color="inherit"
            aria-label="Open drawer"
            disabled={sidebarOpen}
            onClick={clickMenu}
          >
            <MenuIcon />
          </IconButton>
          <div className={sidebarOpen ? classes.spacerDrawerOpen : classes.spacerDrawerClosed} />
          <Typography component="h6">Title</Typography>
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
  transparent: PropTypes.bool.isRequired,
  clickMenu: PropTypes.func.isRequired
};

export default withStyles(styles)(SearchAppBar);
