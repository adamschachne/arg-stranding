import React from "react";
import { HashLoader } from "react-spinners";
import PropTypes from "prop-types";
import "./Loader.css";

const Loader = ({ loading }) => (
  <div className="loader">
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
  loading: PropTypes.bool
};

export default Loader;
