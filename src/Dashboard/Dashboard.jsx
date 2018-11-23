import React from "react";
import { Link } from "react-router-dom";
import { withStyles, createStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import { Zoom, Button } from "@material-ui/core";
import purple from "@material-ui/core/colors/purple";
import NumberToWord from "./NumberToWord.js/NumberToWord";
import Sidebar from "./Sidebar/Sidebar";

const styles = theme => createStyles({
  root: {
    display: "flex",
    fontFamily: "'Source Sans Pro', sans-serif",
  },
  flexCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  dashboard: {
    top: 0,
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
  },
  button: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: "#4A2BBC",
    "&:hover": {
      backgroundColor: purple[300],
    },
    borderRadius: "0px",
    letterSpacing: "10px",
    textIndent: "10px",
    textDecoration: "none",
    textAlign: "center",
    margin: "10px",
    // minWidth: "200px",
    fontFamily: "'Source Sans Pro', sans-serif",
  },
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
    <div className={classes.root}>
      <Sidebar />
      <div>aiwudhaiwud</div>
      {/* <div
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
            <Zoom in>
              <Button
                variant="contained"
                color="primary"
                className={classNames(classes.button)}
                component={Link}
                to="/graph"
                size="large"
              >
                Graph
              </Button>
            </Zoom>
          </div>
        </div>
      </div>
      <div
        className={classes.row}
        style={{ flex: "0 0 auto" }}
      >
        <NumberToWord />
      </div> */}
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
