import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
  form: {
    backgroundColor: 'white',
    fontFamily: "'Source Sans Pro', sans-serif",
    width: '100%',
    height: '100%',
  }
});

const NumberToWord = (props) => {
  return (
    <div >
      Hello
    </div>
  );
}

NumberToWord.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NumberToWord);
