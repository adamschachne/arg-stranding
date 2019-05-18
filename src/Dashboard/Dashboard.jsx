import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { withStyles, createStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Zoom, Button, withTheme, Typography } from "@material-ui/core";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import purple from "@material-ui/core/colors/purple";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import NumberToWord from "./NumberToWord/NumberToWord";
import Sidebar from "./Sidebar/Sidebar";
import SearchAppBar from "../SearchAppBar/SearchAppBar";
import Network from "../Network/Network";

const styles = (theme) =>
  createStyles({
    root: {
      display: "flex"
      // fontFamily: "'Source Sans Pro', sans-serif",
    },
    flexCenter: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    dashboard: {
      top: 0,
      height: "100vh"
      // fontFamily: "'Source Sans Pro', sans-serif",
    },
    row: {
      display: "flex",
      alignItems: "center"
    },
    button: {
      color: theme.palette.getContrastText(purple[500]),
      backgroundColor: "#4A2BBC",
      "&:hover": {
        backgroundColor: purple[300]
      },
      borderRadius: "0px",
      letterSpacing: "10px",
      textIndent: "10px",
      textDecoration: "none",
      textAlign: "center",
      margin: "10px"
      // minWidth: "200px",
      // fontFamily: "'Source Sans Pro', sans-serif",
    },
    content: {
      flexGrow: 1,
      paddingTop: theme.spacing.unit * 3,
      paddingLeft: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit * 3,
      // paddingBottom: theme.spacing.unit * 3,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      marginLeft: 0,
      maxHeight: `calc(100vh - ${theme.spacing.unit * 6}px)`,
      overflowY: "auto",
      marginTop: theme.spacing.unit * 6
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: theme.drawerWidth
    }
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
    const { identity, classes, width, location } = this.props;
    const { open } = this.state;

    console.log(location);

    return (
      <div className={classes.root}>
        <SearchAppBar
          sidebarOpen={open}
          isSwipeable={isSwipeable(width)}
          transparent={false}
          clickMenu={() => this.toggleDrawer(true)}
        />
        <Sidebar
          swipeable={isSwipeable(width)}
          open={open}
          toggleDrawer={this.toggleDrawer}
          identity={identity}
        />
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open && isSwipeable
          })}
        >
          <Switch location={location}>
            <Route exact path="/numbers" component={NumberToWord} />
            <Route
              path="/graph"
              render={() => (
                <Network
                  style={{
                    backgroundColor: "#36393f"
                  }}
                  // renderMenu={this.renderMenu}
                />
              )}
            />
            <Route exact path="/1" render={() => <Typography>1</Typography>} />
            <Route exact path="/2" render={() => <Typography>2</Typography>} />
            <Route exact path="/3" render={() => <Typography>3</Typography>} />
            <Route exact path="/" render={() => <Typography>home</Typography>} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
          {/* <NumberToWord />
          <div
            className={classes.row}
            style={{ flex: "0.5 0 auto" }}
          >
            <div>
              <Zoom in>
                <Button
                  variant="contained"
                  color="primary"
                  className={classNames(classes.button)}
                  component={Link}
                  to="/graph"
                  size="large"
                >
                  Graph
                </Button>
              </Zoom>
            </div>
          </div> */}
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
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired,
  identity: PropTypes.shape({
    avatar: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    username: PropTypes.string
  }).isRequired,
  width: PropTypes.string.isRequired
};

export default withStyles(styles)(withWidth()(Dashboard));
