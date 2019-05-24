import React from "react";
import PropTypes from "prop-types";
import { createStyles, withStyles, Avatar, IconButton, Typography } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import { SettingsConsumer } from "../../Settings/SettingsContext";

const BASE_URL = "https://cdn.discordapp.com/";

/** @param {import("@material-ui/core").Theme} theme */
const styles = (theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      height: theme.spacing(7),
      // backgroundColor: fade(theme.palette.common.white, 0.2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      userSelect: "none"
    },
    username: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      flex: 1
    },
    avatarIcon: {
      width: "100%",
      height: "100%",
      backgroundSize: "cover"
    }
  });

const AvatarIcon = ({ src, className }) => (
  <div className={className} style={{ backgroundImage: `url(${src})` }} />
);
AvatarIcon.propTypes = {
  className: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired
};

const UserDetails = (props) => {
  const {
    classes,
    identity: { avatar, username, id }
  } = props;
  const isGuest = !username;
  const avatarURL =
    BASE_URL + (isGuest ? `embed/avatars/${avatar}.png` : `avatars/${id}/${avatar}.png`);
  const name = isGuest ? "Guest" : username;
  return (
    <SettingsConsumer>
      {({ openSettings }) => {
        return (
          <div className={classes.root}>
            <Avatar component="div" alt="Avatar">
              <AvatarIcon className={classes.avatarIcon} src={avatarURL} />
            </Avatar>
            <div className={classes.username}>
              <Typography>{name}</Typography>
            </div>
            <IconButton color="secondary" aria-label="Settings" onClick={openSettings}>
              <SettingsIcon />
            </IconButton>
          </div>
        );
      }}
    </SettingsConsumer>
  );
};

UserDetails.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  identity: PropTypes.shape({
    avatar: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    username: PropTypes.string
  }).isRequired
};

export default withStyles(styles)(UserDetails);
