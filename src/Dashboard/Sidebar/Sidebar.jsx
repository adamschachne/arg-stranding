import React from "react";
import {
  Drawer, withStyles, createStyles, Hidden, SwipeableDrawer
} from "@material-ui/core";
import PropTypes from "prop-types";
import image from "../../assets/sidebar-4.jpg";

const styles = theme => createStyles({
  logo: {
    position: "relative",
    padding: "15px 15px",
    zIndex: "4",
    "&:after": {
      content: `""`,
      position: "absolute",
      bottom: "0",

      height: "1px",
      right: "15px",
      width: "calc(100% - 30px)",
      backgroundColor: "rgba(180, 180, 180, 0.3)"
    }
  },
  drawerPaper: {
    border: "none",
    position: "fixed",
    top: "0",
    bottom: "0",
    left: "0",
    width: 260,
    // zIndex: "1",
    // width: drawerWidth,
    // [theme.breakpoints.up("md")]: {
    //   width: drawerWidth,
    //   position: "fixed",
    //   height: "100%"
    // },
    // [theme.breakpoints.down("sm")]: {
    //   width: drawerWidth,
    //   ...boxShadow,
    //   position: "fixed",
    //   display: "block",
    //   top: "0",
    //   height: "100vh",
    //   right: "0",
    //   left: "auto",
    //   zIndex: "1032",
    //   visibility: "visible",
    //   overflowY: "visible",
    //   borderTop: "none",
    //   textAlign: "left",
    //   paddingRight: "0px",
    //   paddingLeft: "0",
    //   transform: `translate3d(${drawerWidth}px, 0, 0)`,
    //   ...transition
    // }
  },
  background: {
    position: "absolute",
    zIndex: "1",
    height: "100%",
    width: "100%",
    display: "block",
    top: "0",
    left: "0",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    "&:after": {
      position: "absolute",
      zIndex: "3",
      width: "100%",
      height: "100%",
      content: `""`,
      display: "block",
      background: "#000",
      opacity: ".8"
    }
  },
});

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  render() {
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <>
        <Hidden smDown implementation="css">
          <Drawer
            anchor="left"
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <div className={classes.logo}>
              ARG Stranding
            </div>
            <div
              className={classes.background}
              style={{ backgroundImage: `url(${image})` }}
            />
          </Drawer>
        </Hidden>
        <Hidden smUp>
          <SwipeableDrawer
            // variant="permanent"
            open={open}
            onOpen={() => this.setState({ open: true })}
            onClose={() => this.setState({ open: false })}
          >
            <div className={classes.logo}>
              ARG Stranding
            </div>
            <div
              className={classes.background}
              style={{ backgroundImage: `url(${image})` }}
            />
          </SwipeableDrawer>
        </Hidden>
      </>
    );
  }
}

Sidebar.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

export default withStyles(styles)(Sidebar);
