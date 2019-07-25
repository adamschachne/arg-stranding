import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { withStyles, createStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import PropTypes from "prop-types";
import Zoom from "@material-ui/core/Zoom";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import "./Landing.css";

/** @param {import("@material-ui/core").Theme} theme */
const styles = (theme) =>
  createStyles({
    root: {
      color: theme.palette.getContrastText("#4A2BBC")
    },
    button: {
      backgroundColor: "#4A2BBC",
      "&:hover": {
        backgroundColor: lighten("#4A2BBC", 0.1)
      },
      borderRadius: "0px",
      letterSpacing: "10px",
      textIndent: "10px",
      textDecoration: "none",
      textAlign: "center",
      margin: "10px",
      minWidth: "200px",
      fontWeight: 300
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
      flexDirection: "row"
    },
    wrapper: {
      margin: theme.spacing(1),
      position: "relative"
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
      exit: 200
    };
    return (
      <div className={classNames("landing-page", classes.root)}>
        <div className="landing-credit">CREATED BY IXENBAY</div>
        <div className="landing-header">
          <div>ARG</div>
          <div>STRANDING</div>
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
                onClick={() => this.setState({ clicked: true })}
                size="large"
              >
                connect
              </Button>
            </Zoom>
          </div>
          <div className={classes.stackButtons}>
            <Zoom in={clicked} timeout={transitionDuration} style={{ zIndex: clicked ? 1 : -1 }}>
              <Button
                variant="contained"
                color="primary"
                className={classNames(classes.button)}
                size="large"
                onClick={() => {
                  window.location.href = "/auth";
                }}
              >
                discord
              </Button>
            </Zoom>
            <Zoom in={clicked} timeout={transitionDuration} style={{ zIndex: clicked ? 1 : -1 }}>
              <div className={classes.wrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classNames(classes.button)}
                  size="large"
                  onClick={clickGuest}
                >
                  guest
                </Button>
                {/* {loading && <CircularProgress size={24} className={classes.buttonProgress} />} */}
              </div>
            </Zoom>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    button: PropTypes.string,
    buttonGroup: PropTypes.string,
    stackButtons: PropTypes.string,
    wrapper: PropTypes.string
  }).isRequired,
  clickGuest: PropTypes.func.isRequired
};

export default withStyles(styles)(Landing);
