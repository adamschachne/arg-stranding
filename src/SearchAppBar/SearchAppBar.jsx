import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  AppBar, withStyles, IconButton, Toolbar, Typography, InputBase, Collapse
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
  }

  hideToolbar = () => {
    this.setState({ show: false });
  }

  render() {
    const { classes } = this.props;
    const { show } = this.state;

    return (
      <div
        className={classes.root}
        onMouseOver={this.showToolbar}
        onFocus={this.showToolbar}
        onMouseLeave={this.hideToolbar}
        onBlur={this.hideToolbar}
      >
        <AppBar
          className={classes.transparentBar}
          position="absolute"
        >
          {/* <Collapse in={show}> */}
          <Toolbar
            className={classes.fixedGutter}
            variant="dense"
          >
            <IconButton
              className={classes.allPointerEvents}
              color="inherit"
              aria-label="Open drawer"
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
                  input: classes.inputInput,
                }}
              />
            </div>
          </Toolbar>
          {/* </Collapse> */}
        </AppBar>
      </div>
    );
  }
}

SearchAppBar.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

export default withStyles(styles)(SearchAppBar);
