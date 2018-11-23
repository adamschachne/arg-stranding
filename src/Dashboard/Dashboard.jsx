import React from "react";
import { Link } from "react-router-dom";
import { withStyles, createStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import { Zoom, Button, withTheme } from "@material-ui/core";
import purple from "@material-ui/core/colors/purple";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import NumberToWord from "./NumberToWord.js/NumberToWord";
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
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    width: 60,
    height: 60,
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
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -theme.drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
});

const BASE_URL = "https://cdn.discordapp.com/";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  toggleDrawer = (value) => {
    this.setState({ open: value });
  }

  render() {
    const { identity: { avatar, username, id }, classes, width } = this.props;
    const { open } = this.state;
    const isGuest = !username;
    const avatarURL = BASE_URL + (isGuest ? `embed/avatars/${avatar}.png` : `avatars/${id}/${avatar}.png`);
    const name = isGuest ? "Guest" : username;
    const isSwipeable = !isWidthUp("sm", width);
    return (
      <div className={classes.root}>
        <SearchAppBar clickMenu={() => this.toggleDrawer(true)} />
        <Sidebar
          swipeable={isSwipeable}
          open={!isSwipeable || open}
          toggleDrawer={this.toggleDrawer}
        />
        {/* <main
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
        </main> */}
        {/* <div>aiwudhaiwud</div> */}
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
