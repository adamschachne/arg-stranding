import React from "react";
import PropTypes from "prop-types";
import SettingsIcon from "@material-ui/icons/Settings";
import { IconButton, withStyles, createStyles } from "@material-ui/core";
import classNames from "classnames";

/** @param {import("@material-ui/core").Theme} theme */
const styles = (theme) =>
  createStyles({
    bottomLeft: {
      bottom: 0,
      left: theme.spacing(1),
      position: "absolute",
      zIndex: 100
    },
    white: {
      color: "white"
    }
  });

class GraphSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, toggleBruteForce, disabled } = this.props;
    return (
      <div className={classes.bottomLeft}>
        <IconButton disabled={disabled} onClick={toggleBruteForce} aria-label="Settings">
          <SettingsIcon className={classNames(!disabled && classes.white)} />
        </IconButton>
      </div>
    );
  }
}

GraphSettings.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  toggleBruteForce: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default withStyles(styles)(GraphSettings);
