import React from "react";
import {
  withStyles,
  SwipeableDrawer,
  IconButton,
  Divider,
  List,
  ListItem,
  Typography
} from "@material-ui/core";
import classNames from "classnames";
import PropTypes from "prop-types";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { Link } from "react-router-dom";
import styles from "./styles";
import UserDetails from "./UserDetails";

const Sidebar = ({ open, classes, toggleDrawer, swipeable, identity }) => {
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
      open={open}
      onOpen={() => toggleDrawer(true)}
      onClose={() => toggleDrawer(false)}
      className={classes.drawer}
      classes={{
        paper: classNames(classes.drawerPaper, classes.background)
      }}
    >
      <div className={classes.logo}>
        <Typography>ARG STRANDING</Typography>
        <IconButton className={classes.end} onClick={() => toggleDrawer(false)}>
          <ChevronLeftIcon color="secondary" />
        </IconButton>
      </div>
      <Divider
        classes={{
          root: classes.dividerRoot
        }}
        variant="middle"
      />
      <div className={classes.sidebarMenu}>
        <List>
          {[
            { to: "", text: "HOME" },
            { to: "numbers", text: "NUMBER TO WORDS" },
            { to: "graph", text: "GRAPH" }
          ].map(({ to, text }) => (
            <ListItem
              key={to}
              draggable={false}
              className={classes.menuButton}
              button
              component={Link}
              to={to}
            >
              <Typography variant="button">{text}</Typography>
            </ListItem>
          ))}
        </List>
      </div>
      <Divider
        classes={{
          root: classes.dividerRoot
        }}
        variant="middle"
      />
      <UserDetails identity={identity} />
    </SwipeableDrawer>
  );
};

Sidebar.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  open: PropTypes.bool.isRequired,
  swipeable: PropTypes.bool.isRequired,
  identity: PropTypes.shape({
    avatar: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    username: PropTypes.string
  }).isRequired,
  toggleDrawer: PropTypes.func.isRequired
};

export default withStyles(styles)(Sidebar);
