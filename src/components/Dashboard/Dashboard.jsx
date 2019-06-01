import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { withStyles, createStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
// import { TransitionGroup, CSSTransition } from "react-transition-group";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import { withTheme } from "@material-ui/styles";
import NumberToWord from "../NumberToWord/NumberToWord";
import Sidebar from "../Sidebar/Sidebar";
import SearchAppBar from "../SearchAppBar/SearchAppBar";
import Network from "../Network/Network";

const resize = () => {
  // We execute the same script as before
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  // console.log("resize");
};

window.addEventListener("resize", resize);

resize();

const styles = (theme) =>
  createStyles({
    root: {
      display: "flex",
      maxHeight: "100vh",
      height: "calc(var(--vh, 1vh) * 100)"
    },
    content: {
      flexGrow: 1,
      // paddingTop: theme.spacing(1),
      // paddingLeft: theme.spacing(1),
      // paddingRight: theme.spacing(1),
      // paddingBottom: theme.spacing(1),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      marginLeft: 0,
      marginTop: theme.spacing(6),
      overflowY: "auto"
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: theme.drawerWidth
    }
    // graphWidth: {
    //   width: `calc(100vw - ${theme.spacing(2)}px)`
    // }
  });

const isSwipeable = (width) => !isWidthUp("sm", width);

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: !isSwipeable(props.width)
    };
  }

  toggleDrawer = (value) => {
    this.setState({ open: value });
  };

  render() {
    const { identity, classes, width, theme } = this.props;
    const { open } = this.state;
    const { drawerWidth } = theme;
    const swipeable = isSwipeable(width);
    const sidebarOpen = open && !swipeable;
    return (
      <div className={classes.root}>
        <SearchAppBar
          sidebarOpen={sidebarOpen}
          transparent={false}
          clickMenu={() => this.toggleDrawer(true)}
        />
        <Sidebar
          swipeable={swipeable}
          open={open}
          toggleDrawer={this.toggleDrawer}
          identity={identity}
        />
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: sidebarOpen
          })}
        >
          <Switch>
            <Route exact path="/numbers" component={NumberToWord} />
            <Route
              path="/graph"
              render={() => (
                <Network
                  offsetX={sidebarOpen ? drawerWidth / 2 : 0}
                  className={classes.graphWidth}
                />
              )}
            />
            <Route
              exact
              path="/"
              render={() => (
                <>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>home</Typography>
                  <Typography>hom3e</Typography>
                  <Typography>ho3me</Typography>
                  <Typography>hom3e</Typography>
                  <Typography>hom123e</Typography>
                </>
              )}
            />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </main>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.shape({
    avatar: PropTypes.string,
    bigAvatar: PropTypes.string
  }).isRequired,
  theme: PropTypes.shape({
    drawerWidth: PropTypes.number
  }).isRequired,
  identity: PropTypes.shape({
    avatar: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    username: PropTypes.string
  }).isRequired,
  width: PropTypes.string.isRequired
};

export default withStyles(styles)(withWidth()(withTheme(Dashboard)));
