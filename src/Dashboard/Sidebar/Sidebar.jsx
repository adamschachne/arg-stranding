import React from "react";
import {
  Drawer, withStyles, createStyles, Hidden, SwipeableDrawer
} from "@material-ui/core";
import classNames from "classnames";
import PropTypes from "prop-types";
import image from "../../assets/sidebar.png";

const DRAWER_WIDTH = 260;

const styles = theme => createStyles({
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  logo: {
    position: "relative",
    padding: "15px 15px",
    zIndex: "1",
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
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -DRAWER_WIDTH,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  drawerPaper: {
    width: DRAWER_WIDTH,
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
});

function MakeDrawer({
  classes,
  swipeable,
  open,
  toggleDrawer
}) {
  return (
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
      </div>
    </SwipeableDrawer>
  );
}
MakeDrawer.defaultProps = {
  swipeable: false,
  open: true
};

MakeDrawer.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  swipeable: PropTypes.bool,
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func.isRequired
};

class Sidebar extends React.Component {
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
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <>
        <Hidden only={["sm", "xs"]}>
          <MakeDrawer classes={classes} swipeable={false} toggleDrawer={this.toggleDrawer} />
        </Hidden>
        <Hidden mdUp>
          <MakeDrawer classes={classes} swipeable open={open} toggleDrawer={this.toggleDrawer} />
        </Hidden>
      </>
    );
  }
}

Sidebar.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

export default withStyles(styles)(Sidebar);
