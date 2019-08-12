import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { AppBar, withStyles, IconButton, Toolbar, Typography } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import styles from "./styles";
import routes from "../Routes/routes";
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

    // memo route info
    this.lastRoute = {
      title: "",
      transparentToolbar: false,
      typeToSearch: false
    };
    this.lastPath = undefined;
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onWindowKeydown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onWindowKeydown);
  }

  getRouteData = () => {
    const {
      location: { pathname }
    } = this.props;

    // use memoized route instead of searching for new one
    if (pathname === this.lastPath) {
      return this.lastRoute;
    }

    const route = routes.find((rt) => {
      if (rt.exact === true) {
        return rt.path === pathname;
      }
      return pathname.split("/")[1] === rt.path.split("/")[1];
    }) || {
      title: "",
      transparentToolbar: false,
      typeToSearch: false
    };

    this.lastPath = pathname;
    this.lastRoute = {
      title: route ? route.title : "",
      transparentToolbar: route.transparentToolbar,
      typeToSearch: route.typeToSearch
    };
    return this.lastRoute;
  };

  // eslint-disable-next-line complexity
  onWindowKeydown = (event) => {
    const { current } = this.inputRef;
    const { activeElement } = document;
    const { typeToSearch } = this.getRouteData();

    if (!current) {
      return;
    }

    if (isCtrlF(event)) {
      // stop normal ctrl+f behavior
      event.preventDefault();
      current.focus();
    }

    if (activeElement !== current && isPrintable(event) && typeToSearch) {
      current.focus();
    }
  };

  render() {
    const { classes, clickMenu, sidebarOpen } = this.props;
    const { title, transparentToolbar } = this.getRouteData();
    console.log("top bar render", title);
    return (
      <AppBar
        className={classNames(classes.appBar, {
          [classes.transparentBar]: transparentToolbar
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
            {transparentToolbar === false && (
              <Typography className={classes.title} noWrap component="h6">
                {title}
              </Typography>
            )}
          </div>
          <Search sidebarOpen={sidebarOpen} inputRef={this.inputRef} classes={classes} />
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
