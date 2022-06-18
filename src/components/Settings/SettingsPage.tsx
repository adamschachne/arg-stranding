import React, { PureComponent } from "react";
import { withStyles, createStyles, Theme, WithStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
// import Button from "@material-ui/core/Button";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button
} from "@material-ui/core";
import classNames from "classnames";
import { SettingsConsumer } from "./SettingsContext";

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: theme.spacing(50),
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(4),
      outline: "none",
      top: "50%",
      left: "50%",
      transform: `translate(-50%, -50%)`
    },
    root: {
      display: "flex"
    },
    formControl: {
      margin: theme.spacing(3)
    },
    group: {
      margin: theme.spacing(1, 0)
    },
    button: {
      borderRadius: "0px",
      textAlign: "center",
      margin: "10px",
      minWidth: "100px"
    }
  });

interface SettingsProps extends WithStyles<typeof styles> {}
interface SettingsState {
  loading: boolean;
}

class Settings extends PureComponent<SettingsProps, SettingsState> {
  constructor(props: SettingsProps) {
    super(props);
    this.state = {
      loading: false
    };
  }

  signout = async () => {
    try {
      this.setState({ loading: true });
      const signout = await fetch("/signout", {
        credentials: "same-origin",
        method: "delete"
      });
      this.setState({ loading: false });
      if (signout.status === 200) {
        window.location.href = "/";
      } else {
        console.log("failed to signout");
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { classes } = this.props;
    const { loading } = this.state;

    return (
      <SettingsConsumer>
        {({ themeType, closeSettings, isOpen, changeTheme }) => (
          <Modal open={isOpen} onClose={closeSettings}>
            <div className={classes.paper}>
              <Typography variant="h6">Settings</Typography>
              <div className={classes.root}>
                <FormControl component="fieldset" className={classes.formControl}>
                  <FormLabel focused={false} color="primary" component="legend">
                    Theme
                  </FormLabel>
                  <RadioGroup value={themeType} className={classes.group} onChange={changeTheme}>
                    <FormControlLabel value="dark" control={<Radio />} label="Dark" />
                    <FormControlLabel value="light" control={<Radio />} label="Light" />
                  </RadioGroup>
                </FormControl>
              </div>
              <Button
                variant="outlined"
                disabled={loading}
                className={classNames(classes.button)}
                onClick={this.signout}
                size="medium"
              >
                signout
              </Button>
            </div>
          </Modal>
        )}
      </SettingsConsumer>
    );
  }
}

// We need an intermediary variable for handling the recursive nesting.
export default withStyles(styles)(Settings);
