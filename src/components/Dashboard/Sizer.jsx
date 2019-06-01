import React from "react";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import PropTypes from "prop-types";

class Sizer extends React.Component {
  constructor(props) {
    super(props);
    const { up, width } = this.props;
    console.log(width);
  }

  componentDidUpdate() {
    const { up, update, width } = this.props;
    console.log(width);
    const nextUp = isWidthUp("sm", width);
    console.log(nextUp);
    if (nextUp !== up) {
      console.log("smUp", nextUp);
      // update(nextUp);
    }
  }

  render() {
    return null;
  }
}

Sizer.propTypes = {
  width: PropTypes.string.isRequired,
  up: PropTypes.bool.isRequired,
  update: PropTypes.func.isRequired
};

export default withWidth()(Sizer);
