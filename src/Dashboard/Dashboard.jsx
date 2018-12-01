import React from "react";
import { Link } from "react-router-dom";
import { withStyles, createStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import {
  Zoom, Button, withTheme, Typography
} from "@material-ui/core";
import purple from "@material-ui/core/colors/purple";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import NumberToWord from "./NumberToWord/NumberToWord";
import Sidebar from "./Sidebar/Sidebar";
import SearchAppBar from "../SearchAppBar/SearchAppBar";
import Sizer from "./Sizer";

const styles = theme => createStyles({
  root: {
    display: "flex",
    fontFamily: "'Source Sans Pro', sans-serif",
  },
  flexCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  dashboard: {
    top: 0,
    height: "100vh",
    fontFamily: "'Source Sans Pro', sans-serif",
  },
  row: {
    display: "flex",
    alignItems: "center"
  },
  button: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: "#4A2BBC",
    "&:hover": {
      backgroundColor: purple[300],
    },
    borderRadius: "0px",
    letterSpacing: "10px",
    textIndent: "10px",
    textDecoration: "none",
    textAlign: "center",
    margin: "10px",
    // minWidth: "200px",
    fontFamily: "'Source Sans Pro', sans-serif",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    // paddingRight: theme.spacing.unit * 3,
    // paddingBottom: theme.spacing.unit * 3,
    // paddingLeft: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: theme.drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    height: theme.spacing.unit * 6,
    justifyContent: "flex-end",
  },
});

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: isWidthUp("md", props.width)
    };
  }

  toggleDrawer = (value) => {
    this.setState({ open: value });
  }

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
          <div className={classes.drawerHeader} />
          <NumberToWord />
        </main>
        {/* <div
          className={classes.row}
          style={{ flex: "0.5 0 auto" }}
        >
          <div className={classes.flexCenter}>
            <Avatar
              alt="Avatar"
              src={avatarURL}
              className={classNames(classes.avatar, classes.bigAvatar)}
            />
            <div>
              {name}
            </div>
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
          </div>
        </div>
        <div
          className={classes.row}
          style={{ flex: "0 0 auto" }}
        >
          <NumberToWord />
        </div> */}
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.shape({
    avatar: PropTypes.string,
    bigAvatar: PropTypes.string
  }).isRequired,
  identity: PropTypes.shape({
    avatar: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    username: PropTypes.string,
  }).isRequired,
  width: PropTypes.string.isRequired
};

export default withStyles(styles)(withWidth()(Dashboard));
