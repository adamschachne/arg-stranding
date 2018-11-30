import React from "react";
import { HashLoader } from "react-spinners";
import PropTypes from "prop-types";
import { createStyles, withStyles } from "@material-ui/core";

const styles = createStyles({
  centered: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)"
  }
});

const Loader = ({ loading, classes }) => (
  <div className={classes.centered}>
    <HashLoader
      loading={loading}
      color="#eeeeee"
    />
  </div>
);

Loader.defaultProps = {
  loading: true
};

Loader.propTypes = {
  classes: PropTypes.shape({
    centered: PropTypes.string.isRequired
  }).isRequired,
  loading: PropTypes.bool
};

export default withStyles(styles)(Loader);
