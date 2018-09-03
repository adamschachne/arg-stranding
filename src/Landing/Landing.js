import React from 'react'
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import purple from '@material-ui/core/colors/purple';
import './Landing.css'

const styles = theme => ({
  button: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    '&:hover': {
      backgroundColor: purple[700],
    },
    borderRadius: '0px',
    letterSpacing: '10px',
    textIndent: '10px',
    textDecoration: 'none',
    textAlign: 'center'
  },
  buttonGroup: {}
});

const Landing = (props) => {

  const { classes } = props;

  return (
    <div className="landing-page">
      <div className="landing-item">created by Ixenbay</div>
      <div className="landing-header landing-item">ARG Stranding</div>
      <div>

        <Button
          variant="contained"
          color="primary"
          className={classNames(classes.button)}
          component={Link} to="/graph"
        >
          connect
        </Button>
      </div>
      {/* <Link to="/graph">Graph</Link> */}
    </div >
  );
}

Landing.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Landing);