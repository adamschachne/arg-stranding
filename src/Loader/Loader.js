import React from 'react';
import { HashLoader } from "react-spinners";
import PropTypes from 'prop-types';
import './Loader.css';

const Loader = ({ progress, loading }) => (
  <div className="loader">
    <HashLoader
      loading={loading}
      color={'#eeeeee'}
    />
  </div>
);

Loader.propTypes = {
  progress: PropTypes.number,
  loading: PropTypes.bool
}

export default Loader;