import React from "react";
import { Link } from "react-router-dom";
import { withStyles, createStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import NumberToWord from "./NumberToWord.js/NumberToWord";

const styles = () => createStyles({
  flexCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  dashboard: {
    width: "100vw",
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
  }
});

const BASE_URL = "https://cdn.discordapp.com/";

const Dashboard = ({ identity: { avatar, username, id }, classes }) => {
  const isGuest = !username;
  let avatarURL = BASE_URL;

  if (isGuest) {
    avatarURL += `embed/avatars/${avatar}.png`;
  } else {
    avatarURL += `avatars/${id}/${avatar}.png`;
  }

  const name = isGuest ? "Guest" : username;

  return (
    <div className={classNames(classes.dashboard, classes.flexCenter)}>
      <div
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
            <Link to="/graph">
              <div style={{ color: "#eeeeee" }}>Network Graph</div>
            </Link>
          </div>
        </div>
      </div>
      <div
        className={classes.row}
        style={{ flex: "0 0 auto" }}
      >
        <NumberToWord />
      </div>
    </div>
  );
};


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
};

export default withStyles(styles)(Dashboard);
