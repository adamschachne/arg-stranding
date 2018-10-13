import React from "react"
import { Link } from "react-router-dom";
import { withStyles, createStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import NumberToWord from "./NumberToWord.js/NumberToWord";

const styles = () => createStyles({
  dashboard: {
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "column",
    alignItems: "center",
    width: "100vw",
    height: "100vh"
  },
  row: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Source Sans Pro', sans-serif",
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

const Dashboard = (props) => {
  const { classes } = props;
  const { avatar, username, id } = props.identity;

  const isGuest = username ? false : true;
  let avatarURL = BASE_URL;

  if (isGuest) {
    avatarURL += `embed/avatars/${avatar}.png`;
  } else {
    avatarURL += `avatars/${id}/${avatar}.png`;
  }

  const name = isGuest ? "Guest" : username;

  return (
    <div className={classes.dashboard}>
      <div className={classes.row}>
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
      <div className={classes.row}>
        <NumberToWord />
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  identity: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
