import React from 'react';
import { BeatLoader } from "react-spinners";
import PropTypes from 'prop-types';
import './Loader.css';

const Loader = ({ progress, loading }) => (
  <div className="loader">
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