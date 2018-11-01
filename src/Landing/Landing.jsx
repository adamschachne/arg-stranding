import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { withStyles, createStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import PropTypes from "prop-types";
import purple from "@material-ui/core/colors/purple";
import Zoom from "@material-ui/core/Zoom";

import "./Landing.css";

const styles = theme => createStyles({
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
    minWidth: "200px",
    fontFamily: "'Source Sans Pro', sans-serif",
    // [theme.breakpoints.down('400')]: {
    //   maxWidth: '100px'
    // },
  },
  stackButtons: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    flexDirection: "row"
  },
  buttonGroup: {
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
  }
});

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    };
  }

  render() {
    const { classes, clickGuest } = this.props;
    const { clicked } = this.state;
    const transitionDuration = {
      enter: 200,
      exit: 200,
    };
    return (
      <div className="landing-page">
        <div className="landing-credit">created by Ixenbay</div>
        <div className="landing-header">
          <div>ARG</div>
          <div>Stranding</div>
        </div>

        <div className={classes.buttonGroup}>
          <div className={classes.stackButtons}>
            <Zoom
              in={!clicked}
              timeout={transitionDuration}
              unmountOnExit
              style={{ zIndex: clicked ? -1 : 1 }}
            >
              <Button
                variant="contained"
                color="primary"
                className={classNames(classes.button)}
                // component={Link} to="/graph"
                onClick={() => this.setState({ clicked: true })}
                size="large"
              >
                connect
              </Button>
            </Zoom>
          </div>
          <div className={classes.stackButtons}>
            <Zoom
              in={clicked}
              timeout={transitionDuration}
              style={{ zIndex: clicked ? 1 : -1 }}
            >
              <Button
                variant="contained"
                color="primary"
                className={classNames(classes.button)}
                size="large"
                onClick={() => { window.location.href = "/auth"; }}
              >
                discord
              </Button>
            </Zoom>
            <Zoom
              in={clicked}
              timeout={transitionDuration}
              style={{ zIndex: clicked ? 1 : -1 }}
            >
              <Button
                variant="contained"
                color="primary"
                className={classNames(classes.button)}
                size="large"
                onClick={clickGuest}
              >
                guest
              </Button>
            </Zoom>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  classes: PropTypes.shape({ button: PropTypes.string }).isRequired,
  clickGuest: PropTypes.func.isRequired
};

export default withStyles(styles)(Landing);
