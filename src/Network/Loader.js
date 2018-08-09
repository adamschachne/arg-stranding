import React from 'react';
import { BeatLoader } from "react-spinners";
import PropTypes from 'prop-types';

const Loader = ({ progress, loading }) => (
  <div style={{ position: "absolute" }}>
    <BeatLoader
      color={'#FFFFFF'}
      size={30}
      loading={loading}
    />
  </div>
);

Loader.propTypes = {
  progress: PropTypes.number,
  loading: PropTypes.bool
}

export default Loader;