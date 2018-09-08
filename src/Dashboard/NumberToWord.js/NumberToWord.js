import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import FileCopy from '@material-ui/icons/FileCopy';
import writtenNumber from 'written-number';
import copy from 'copy-to-clipboard';

const styles = theme => ({
  form: {
    // backgroundColor: 'white',
    // fontFamily: "'Source Sans Pro', sans-serif",
    // paddingTop: '50px',
    paddingBottom: '10vh'
    // width: '50vw',
    // height: '50vh'
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

function numberToWord(number, withAnd) {
  return writtenNumber(number, { noAnd: !withAnd })
    .split(" ")
    .join("")
    .split("-")
    .join("");
}

class NumberToWord extends Component {
  constructor(props) {
    super(props);

    this.state = {
      number: ''
    };

    this.withAnd = '';
    this.withoutAnd = '';
  }

  handleChange = type => event => {
    // console.log(event.target.value);
    this.setState({ [type]: event.target.value });
  }

  clear = () => {
    this.setState({ number: '' });
  }

  copyToClipboard = type => () => {
    const number = this[type];
    if (number) {
      copy(this[type]);
      console.log(this[type]);
    }
  }

  render() {
    const { classes } = this.props;
    const { number } = this.state;
    this.withAnd = "?" + numberToWord(number, true);
    this.withoutAnd = "?" + numberToWord(number, false);
    // console.log(withAnd, withoutAnd);
    return (
      <div className={classes.form} >
        <Paper className={classNames(classes.root, classes.form)} elevation={1}>
          <Typography variant="headline" component="h3">
            Number to Words Converter
          </Typography>
          {/* <Typography component="p">
            Enter a number
          </Typography> */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >

            <TextField
              id="number"
              label="Number"
              value={this.state.number}
              onChange={this.handleChange('number')}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Clear"
                      onClick={this.clear}
                    >
                      <DeleteTwoToneIcon className={classes.icon} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              margin="normal"
            />
            <TextField
              id="read-only-input"
              label="Without 'and'"
              value={this.withoutAnd}
              margin="normal"
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Copy to Clipboard"
                      onClick={this.copyToClipboard('withoutAnd')}
                    // onMouseDown={this.handleMouseDownPassword}
                    >
                      <FileCopy />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              id="read-only-input"
              label="With 'and'"
              value={this.withAnd}
              margin="normal"
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Copy to Clipboard"
                      onClick={this.copyToClipboard('withAnd')}
                    // onMouseDown={this.handleMouseDownPassword}
                    >
                      <FileCopy />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>
        </Paper>
      </div>
    );
  }
}
NumberToWord.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NumberToWord);
