import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  AppBar, createStyles, withStyles, IconButton, Toolbar, Typography, InputBase, Collapse
} from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import SearchIcon from "@material-ui/icons/Search";
import MenuIcon from "@material-ui/icons/Menu";

/** @param {import("@material-ui/core").Theme} theme */
const styles = theme => createStyles({
  transparentBar: {
    background: "transparent",
    boxShadow: "none",
    pointerEvents: "none"
  },
  fixedGutter: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  allPointerEvents: {
    pointerEvents: "all"
  },
  root: {
    width: "100%",
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    // marginLeft: -12,
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    display: "flex",
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    // backgroundColor: fade(theme.palette.common.white, 0.15),
    // "&:hover": {
    //   backgroundColor: fade(theme.palette.common.white, 0.25),
    // },
    // backgroundColor: fade(theme.palette.common.white, 0.25),
    marginLeft: 0,
    // transition: theme.transitions.create("width"),
    // transition: theme.transitions.create("width", {
    //   duration: "500ms"
    // }),
    // width: "100%",
    // [theme.breakpoints.up("sm")]: {
    //   // marginLeft: theme.spacing.unit,
    //   width: "10%",
    // },
  },
  searchIcon: {
    width: theme.spacing.unit * 6,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    // paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 6,
    // width: "0%",
    // "&focus": {
    //   width: "100%",
    // },
    transition: theme.transitions.create(["width", "background"], {
      duration: "500ms"
    }),
    "&:focus": {
      backgroundColor: fade(theme.palette.common.white, 0.15),
    },
    borderRadius: "4px",
    width: 150,
    maxWidth: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 0,
      "&:focus": {
        width: 150,
      },
    },
  },
});

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
            // disableGutters
            style={{
              justifyContent: "space-between"
            }}
            className={classes.fixedGutter}
            variant="dense"
          >
            <IconButton
              className={classNames(classes.allPointerEvents, classes.menuButton)}
              color="inherit"
              aria-label="Open drawer"
            >
              <MenuIcon />
            </IconButton>
            {/* <div className={classes.grow} /> */}
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
