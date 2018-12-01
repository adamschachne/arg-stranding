import React from "react";
import {
  Drawer, withStyles, createStyles, Hidden, SwipeableDrawer, IconButton, InputAdornment
} from "@material-ui/core";
import classNames from "classnames";
import PropTypes from "prop-types";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import styles from "./styles";

const Sidebar = ({
  open, classes, toggleDrawer, swipeable
}) => {
  return (
    <SwipeableDrawer
      anchor="left"
      disableSwipeToOpen={!swipeable}
      disableDiscovery={!swipeable}
      disableBackdropTransition={!swipeable}
      ModalProps={{
        disablePortal: true
      }}
      variant={swipeable ? "temporary" : "persistent"}
      // variant="persistent"
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
        {/* {swipeable && ( */}
        <IconButton
          className={classes.end}
          onClick={() => toggleDrawer(false)}
        >
          <ChevronLeftIcon color="secondary" />
        </IconButton>
        {/* } */}
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
