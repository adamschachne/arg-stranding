import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { AppBar, withStyles, IconButton, Toolbar, Typography, InputBase } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import styles from "./styles";
import routes from "../Dashboard/routes";
import Search from "./Search";

function isPrintable(event) {
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
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onWindowKeydown);
    window.addEventListener("blur", this.onWindowBlur);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onWindowKeydown);
    window.removeEventListener("blur", this.onWindowBlur);
  }

  onWindowBlur = (event) => {
    console.log("window blur");
    // event.preventDefault();
    console.log(document.activeElement);
  };

  onWindowKeydown = (event) => {
    const { current } = this.inputRef;
    const { activeElement } = document;
    if (activeElement !== current && isPrintable(event)) {
      if (current) current.focus();
    }
  };

  // eslint-disable-next-line complexity
  render() {
    const {
      classes,
      clickMenu,
      sidebarOpen,
      location: { pathname }
    } = this.props;

    const pathNoSlash = pathname.substring(1);
    const route = routes.find((rt) => rt.path === pathNoSlash);
    const title = route ? route.title : "";
    const { transparentToolbar: transparent = false } = route || { transparent: false };

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
          <div
            className={sidebarOpen ? classes.spacerDrawerOpen : classes.spacerDrawerClosed}
            style={{ flex: "auto", width: 0 }}
          >
            {transparent === false && (
              <Typography className={classes.title} noWrap component="h6">
                {title}
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
