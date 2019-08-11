import React from "react";
import {
  createStyles,
  withStyles,
  Avatar,
  IconButton,
  Typography,
  WithStyles,
  Theme
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import { SettingsConsumer } from "../Settings/SettingsContext";

const BASE_URL = "https://cdn.discordapp.com/";

const styles = (theme: Theme) =>
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

interface UserDetailsProps extends WithStyles<typeof styles> {
  identity: {
    avatar: string | number;
    id: string | number;
    username: string;
  };
}

interface AvatarIconProps {
  className: string;
  src: string;
}

const AvatarIcon: React.FC<AvatarIconProps> = ({ src, className }) => (
  <div className={className} style={{ backgroundImage: `url(${src})` }} />
);

const UserDetails: React.FC<UserDetailsProps> = (props) => {
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
      {({ openSettings }) => (
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
      )}
    </SettingsConsumer>
  );
};

export default withStyles(styles)(UserDetails);
