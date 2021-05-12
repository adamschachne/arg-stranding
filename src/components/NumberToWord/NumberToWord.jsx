import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import FileCopy from "@material-ui/icons/FileCopy";
import writtenNumber from "written-number";
import copy from "copy-to-clipboard";
import Tooltip from "@material-ui/core/Tooltip";

/** @param {import("@material-ui/core").Theme} theme */
const styles = (theme) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  black: {
    color: theme.palette.common.black
  },
  arrowPopper: {
    "&[x-placement*='top'] $arrowArrow": {
      bottom: 0,
      left: 0,
      marginBottom: "-0.9em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "1em 1em 0 1em",
        borderColor: `${theme.palette.grey[700]} transparent transparent transparent`
      }
    }
  },
  arrowArrow: {
    position: "absolute",
    fontSize: 7,
    width: "3em",
    height: "3em",
    "&::before": {
      content: `""`,
      margin: "auto",
      display: "block",
      width: 0,
      height: 0,
      borderStyle: "solid"
    }
  }
});

function numberToWord(number, withAnd) {
  return writtenNumber(number, { noAnd: !withAnd }).split(" ").join("").split("-").join("");
}

class NumberToWord extends Component {
  constructor(props) {
    super(props);

    this.state = {
      number: "",
      arrowRef: null,
      tooltip: ""
    };

    this.withAnd = "";
    this.withoutAnd = "";
    this.closeTimer = null;
  }

  handleChange = (type) => (event) => {
    this.setState({ [type]: event.target.value });
  };

  handleArrowRef = (node) => {
    this.setState({
      arrowRef: node
    });
  };

  clear = () => {
    this.setState({ number: "" });
  };

  copyToClipboard = (type) => () => {
    const number = this[type];
    if (number) {
      copy(this[type]);
      console.log(this[type]);
    }
    this.setState({ tooltip: type });
    clearTimeout(this.closeTimer);
    this.closeTimer = setTimeout(() => {
      this.setState({ tooltip: "" });
    }, 1000);
  };

  render() {
    const { classes } = this.props;
    const { number, tooltip, arrowRef } = this.state;
    const error = number > Number.MAX_SAFE_INTEGER;
    this.withAnd = `?${numberToWord(number, true)}`;
    this.withoutAnd = `?${numberToWord(number, false)}`;
    return (
      <Paper square className={classNames(classes.root)} elevation={1}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap"
          }}
        >
          <TextField
            id="number"
            label={error ? "Possible loss of precision" : "Number"}
            error={error}
            value={number}
            onChange={this.handleChange("number")}
            type="number"
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              // className: classes.black,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="Clear" onClick={this.clear}>
                    <DeleteTwoToneIcon className={classes.icon} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          {[
            { type: `withAnd`, label: `With 'And'` },
            { type: `withoutAnd`, label: `Without 'And'` }
          ].map(({ type, label }) => (
            <TextField
              key={type}
              id="read-only-input"
              label={label}
              value={this[type]}
              margin="normal"
              fullWidth
              InputProps={{
                // className: classes.black,
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="Copy to Clipboard" onClick={this.copyToClipboard(type)}>
                      <Tooltip
                        open={tooltip === type}
                        placement="top"
                        title={
                          <>
                            Copied!
                            <span className={classes.arrowArrow} ref={this.handleArrowRef} />
                          </>
                        }
                        classes={{ popper: classes.arrowPopper }}
                        PopperProps={{
                          disablePortal: true,
                          popperOptions: {
                            modifiers: {
                              arrow: {
                                enabled: Boolean(arrowRef),
                                element: arrowRef
                              }
                            }
                          }
                        }}
                      >
                        <FileCopy />
                      </Tooltip>
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          ))}
        </div>
      </Paper>
    );
  }
}
NumberToWord.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    icon: PropTypes.string,
    arrowPopper: PropTypes.string,
    arrowArrow: PropTypes.string
  }).isRequired
};

export default withStyles(styles)(NumberToWord);
