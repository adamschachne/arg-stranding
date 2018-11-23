import React from "react";
import {
  Drawer, withStyles, createStyles, Hidden, SwipeableDrawer, IconButton, InputAdornment
} from "@material-ui/core";
import classNames from "classnames";
import PropTypes from "prop-types";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { fade } from "@material-ui/core/styles/colorManipulator";
import image from "../../assets/sidebar.png";

/** @param {import("@material-ui/core").Theme} theme */
const styles = (theme) => {
  return createStyles({
    drawer: {
      width: theme.drawerWidth,
      flexShrink: 0,
    },
    drawerHeader: {
      zIndex: "1",
      display: "flex",
      alignItems: "center",
      // padding: "0 8px",
      height: theme.spacing.unit * 6,
      justifyContent: "flex-end",
    },
    logo: {
      display: "flex",
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
      height: theme.spacing.unit * 6,
      zIndex: "1",
      "&:after": {
        content: `""`,
        position: "absolute",
        bottom: "0",
        height: "1px",
        right: "15px",
        width: "calc(100% - 30px)",
        backgroundColor: fade(theme.palette.secondary.main, 0.5)
      }
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
    drawerPaper: {
      width: theme.drawerWidth,
      border: "none",
    },
    background: {
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center center",
      "&:after": {
        position: "absolute",
        width: "100%",
        height: "100%",
        content: `""`,
        display: "block",
        background: "#000",
        opacity: "0.7"
      }
    },
    end: {
      position: "absolute",
      right: 0
    }
  });
};

const Sidebar = ({
  open, classes, toggleDrawer, swipeable
}) => {
  return (
    // <MakeDrawer
    //   classes={classes}
    //   swipeable={false}
    //   toggleDrawer={toggleDrawer}
    // />
    <SwipeableDrawer
      anchor="left"
      disableSwipeToOpen={!swipeable}
      disableDiscovery={!swipeable}
      disableBackdropTransition={!swipeable}
      variant={swipeable ? "temporary" : "persistent"}
      open={open}
      onOpen={() => toggleDrawer(true)}
      onClose={() => toggleDrawer(false)}
      className={classes.drawer}
      classes={{
        paper: classNames(classes.drawerPaper, classes.background)
      }}
    >
      <div className={classes.logo}>
        ARG Stranding
        {swipeable && (
          <IconButton
            className={classes.end}
            onClick={() => toggleDrawer(false)}
          >
            <ChevronLeftIcon color="secondary" />
          </IconButton>
        )}
      </div>
    </SwipeableDrawer>
  );
};

Sidebar.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  open: PropTypes.bool.isRequired,
  swipeable: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired
};

export default withStyles(styles)(Sidebar);
