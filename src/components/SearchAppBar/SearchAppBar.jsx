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
import { withRouter } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import MenuIcon from "@material-ui/icons/Menu";
import styles from "./styles";

class SearchAppBar extends React.PureComponent {
  render() {
    const {
      classes,
      transparent,
      clickMenu,
      sidebarOpen,
      location: { pathname }
    } = this.props;

    return (
      <AppBar
        className={classNames(classes.appBar, { [classes.transparentBar]: transparent })}
        position="absolute"
      >
        <Toolbar className={classes.noGutter} variant="dense">
          <IconButton
            className={classes.allPointerEvents}
            color="inherit"
            aria-label="Open drawer"
            disabled={sidebarOpen}
            onClick={clickMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            className={sidebarOpen ? classes.spacerDrawerOpen : classes.spacerDrawerClosed}
            noWrap
            style={{ flex: "auto" }}
            component="h6"
          >
            Title
          </Typography>
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
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
  transparent: PropTypes.bool.isRequired,
  clickMenu: PropTypes.func.isRequired
};

export default withStyles(styles)(withRouter(SearchAppBar));
