import React from "react";
import PropTypes from "prop-types";
import {
  createStyles, withStyles, Avatar, IconButton, Typography
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import classNames from "classnames";

const BASE_URL = "https://cdn.discordapp.com/";

/** @param {import("@material-ui/core").Theme} theme */
const styles = theme => createStyles({
  root: {
    display: "flex",
    alignItems: "center",
    height: theme.spacing.unit * 7,
    // backgroundColor: fade(theme.palette.common.white, 0.2),
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  username: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    flex: 1,
  },
  // avatar: {
  //   margin: 10,
  //   width: 60,
  //   height: 60,
  // },
});

const UserDetails = (props) => {
  const { classes, identity: { avatar, username, id } } = props;
  const isGuest = !username;
  const avatarURL = BASE_URL + (isGuest ? `embed/avatars/${avatar}.png` : `avatars/${id}/${avatar}.png`);
  const name = isGuest ? "Guest" : username;
  return (
    <div className={classes.root}>
      <Avatar
        alt="Avatar"
        src={avatarURL}
      />
      <div className={classes.username}>
        <Typography>{name}</Typography>
      </div>
      <IconButton color="inherit" aria-label="Settings">
        <SettingsIcon />
      </IconButton>
    </div>
  );
};

UserDetails.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  identity: PropTypes.shape({
    avatar: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    username: PropTypes.string,
  }).isRequired
};

export default withStyles(styles)(UserDetails);
