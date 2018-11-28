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

const BASE_URL = "https://cdn.discordapp.com/";

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
    const { identity: { avatar, username, id }, classes, width } = this.props;
    const { open } = this.state;
    const isGuest = !username;
    const avatarURL = BASE_URL + (isGuest ? `embed/avatars/${avatar}.png` : `avatars/${id}/${avatar}.png`);
    const name = isGuest ? "Guest" : username;
    const isSwipeable = !isWidthUp("md", width);
    // const showSidebar = !isSwipeable || open;
    const showSidebar = open;
    return (
      <div className={classes.root}>
        <SearchAppBar
          sidebarOpen={open}
          sidebarSwipeable={isSwipeable}
          transparent={false}
          clickMenu={() => this.toggleDrawer(true)}
        />
        <Sidebar
          swipeable={isSwipeable}
          open={showSidebar}
          toggleDrawer={this.toggleDrawer}
        />
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open && !isSwipeable
          })}
        >
          <div className={classes.drawerHeader} />
          {/* <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent
            elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
            hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
            velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing.
            Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
            viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo.
            Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus
            at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
            ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
          </Typography>
          <Typography paragraph>
            Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
            facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
            tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
            consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus
            sed vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in.
            In hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
            et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique
            sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo
            viverra maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam
            ultrices sagittis orci a.
          </Typography> */}
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
