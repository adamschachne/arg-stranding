import React from "react";
import { Switch, Route } from "react-router-dom";
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

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    props.history.push("/");
    this.state = {
      open: isWidthUp("md", props.width)
    };
  }

  toggleDrawer = (value) => {
    this.setState({ open: value });
  };

  render() {
    const { identity, classes, width } = this.props;
    const { open } = this.state;
    const isSwipeable = !isWidthUp("sm", width);

    return (
      <div className={classes.root}>
        <SearchAppBar
          sidebarOpen={open}
          isSwipeable={isSwipeable}
          transparent={false}
          clickMenu={() => this.toggleDrawer(true)}
        />
        <Sidebar
          swipeable={isSwipeable}
          open={open}
          toggleDrawer={this.toggleDrawer}
          identity={identity}
        />
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open && !isSwipeable
          })}
        >
          <TransitionGroup>
            {/* no different than other usage of
                CSSTransition, just make sure to pass
                `location` to `Switch` so it can match
                the old location as it animates out
            */}
            <CSSTransition key={window.location.key} classNames="fade" timeout={300}>
              <Switch location={window.location}>
                <Route exact path="/numbertowords" component={NumberToWord} />
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
                <Route render={({ location }) => <Typography>nothing here</Typography>} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
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
  identity: PropTypes.shape({
    avatar: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    username: PropTypes.string
  }).isRequired,
  width: PropTypes.string.isRequired
};

export default withStyles(styles)(withWidth()(Dashboard));
