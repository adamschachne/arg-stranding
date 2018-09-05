import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import purple from '@material-ui/core/colors/purple';
import Zoom from '@material-ui/core/Zoom';
import AddIcon from '@material-ui/icons/Add';
import './Landing.css'

const styles = theme => ({
  button: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: "#4A2BBC",
    '&:hover': {
      backgroundColor: purple[300],
    },
    borderRadius: '0px',
    letterSpacing: '10px',
    textIndent: '10px',
    textDecoration: 'none',
    textAlign: 'center',
    margin: '10px',
    minWidth: '200px',
    // [theme.breakpoints.down('400')]: {
    //   maxWidth: '100px'
    // },
  },
  stackButtons: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  buttonGroup: {
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  }
});

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    }
  }

  render() {
    const { classes } = this.props;
    const { clicked } = this.state;
    const transitionDuration = {
      enter: 200,
      exit: 200,
    };
    return (
      <div className="landing-page">
        <div className="landing-item">created by Ixenbay</div>
        <div className="landing-header landing-item">ARG</div>
        <div className="landing-header landing-item">Stranding</div>

        <div className={classes.buttonGroup}>
          <div className={classes.stackButtons}>
            <Zoom
              in={!clicked}
              timeout={transitionDuration}
              unmountOnExit
            >
              <Button
                variant="contained"
                color="primary"
                className={classNames(classes.button)}
                // component={Link} to="/graph"
                onClick={() => this.setState({ clicked: true })}
                size="large"
              >
                connect
              </Button>
            </Zoom>
          </div>
          <div className={classes.stackButtons}>
            <Zoom
              in={clicked}
              timeout={transitionDuration}
              unmountOnExit
            >
              <Button
                variant="contained"
                color="primary"
                className={classNames(classes.button)}
                size="large"
              // component={Link} to="/graph"
              >
                discord
              </Button>
            </Zoom>
            <Zoom
              in={clicked}
              timeout={transitionDuration}
              unmountOnExit
            >
              <Button
                variant="contained"
                color="primary"
                className={classNames(classes.button)}
                size="large"
              >
                guest
              </Button>
            </Zoom>
          </div>
        </div>
        {/* <Link to="/graph">Graph</Link> */}
      </div >
    );
  }
}

Landing.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Landing);
