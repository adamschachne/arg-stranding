import React, { PureComponent } from "react";
import { withStyles, createStyles, Theme, WithStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
// import Button from "@material-ui/core/Button";
import { FormControl, FormLabel, RadioGroup, Radio, FormControlLabel } from "@material-ui/core";
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
    }
  });

interface SettingsProps extends WithStyles<typeof styles> {}

class Settings extends PureComponent<SettingsProps> {
  render() {
    const { classes } = this.props;

    return (
      <SettingsConsumer>
        {({ themeType, closeSettings, isOpen, switchThemeType }) => (
          <Modal open={isOpen} onClose={closeSettings}>
            <div className={classes.paper}>
              <Typography variant="h6">Settings</Typography>
              <div className={classes.root}>
                <FormControl component="fieldset" className={classes.formControl}>
                  <FormLabel component="legend">Theme</FormLabel>
                  <RadioGroup
                    value={themeType}
                    className={classes.group}
                    onChange={switchThemeType}
                  >
                    <FormControlLabel value="dark" control={<Radio />} label="Dark" />
                    <FormControlLabel value="light" control={<Radio />} label="Light" />
                    {/* <FormControlLabel
                    value="disabled"
                    disabled
                    control={<Radio />}
                    label="(Disabled option)"
                  /> */}
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </Modal>
        )}
      </SettingsConsumer>
    );
  }
}

// We need an intermediary variable for handling the recursive nesting.
export default withStyles(styles)(Settings);
