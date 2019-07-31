import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { AppBar, withStyles, IconButton, Toolbar, Typography } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import styles from "./styles";
import routes from "../Dashboard/routes";
import Search from "./Search";

function isFKey(event) {
  if (event.keyCode >= 112 && event.keyCode <= 123) {
    return true;
  }
  return false;
}

function isCtrlF(event) {
  return (event.ctrlKey || event.metaKey) && (event.which === 70 || event.keyCode === 70);
}

function isPrintable(event) {
  // F1 through F12
  if (isFKey(event)) {
    return false;
  }

  // tab or space
  if (event.keyCode === 32 || event.keyCode === 9) {
    return false;
  }

  // pressed key is a char
  if (String.fromCharCode(event.keyCode).match(/(\w|\s)/g)) {
    return true;
  }

  return false;
}

class SearchAppBar extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.hasFocus = false;
    this.inputRef = React.createRef();
    this.setRouteData();
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onWindowKeydown);
    window.addEventListener("blur", this.onWindowBlur);
  }

  componentDidUpdate() {
    this.setRouteData();
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onWindowKeydown);
    window.removeEventListener("blur", this.onWindowBlur);
  }

  setRouteData = () => {
    const {
      location: { pathname }
    } = this.props;

    const pathNoSlash = pathname.substring(1);
    const route = routes.find((rt) => rt.path === pathNoSlash) || {
      title: "",
      transparentToolbar: false,
      typeToSearch: false
    };

    this.title = route ? route.title : "";
    this.transparentToolbar = route.transparentToolbar;
    this.typeToSearch = route.typeToSearch;
  };

  onWindowBlur = (event) => {
    // console.log("window blur");
    // event.preventDefault();
    // console.log(document.activeElement);
  };

  // eslint-disable-next-line complexity
  onWindowKeydown = (event) => {
    const { current } = this.inputRef;
    const { activeElement } = document;

    if (!current) {
      return;
    }

    if (isCtrlF(event)) {
      // stop normal ctrl+f behavior
      event.preventDefault();
      current.focus();
    }

    if (activeElement !== current && isPrintable(event) && this.typeToSearch) {
      current.focus();
    }
  };

  render() {
    const { classes, clickMenu, sidebarOpen } = this.props;

    return (
      <AppBar
        className={classNames(classes.appBar, {
          [classes.transparentBar]: this.transparentToolbar
        })}
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
          <div
            className={sidebarOpen ? classes.spacerDrawerOpen : classes.spacerDrawerClosed}
            style={{ flex: "auto", width: 0 }}
          >
            {this.transparentToolbar === false && (
              <Typography className={classes.title} noWrap component="h6">
                {this.title}
              </Typography>
            )}
          </div>
          <Search inputRef={this.inputRef} classes={classes} />
        </Toolbar>
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
  clickMenu: PropTypes.func.isRequired
};

export default withStyles(styles)(withRouter(SearchAppBar));
