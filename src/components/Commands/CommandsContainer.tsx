import React from "react";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import { StateConsumer } from "../State";
import Command from "./Command";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1)
    },
    spaceBefore: {
      marginTop: theme.spacing(1)
    }
  });

interface Props extends WithStyles<typeof styles> {}

// container for all commands
class CommandsContainer extends React.Component<Props> {
  state = {};

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <StateConsumer>
          {({ items }) =>
            items.map((item, index) => (
              <div key={item.id} className={index > 0 ? classes.spaceBefore : ""}>
                <Command item={item} />
              </div>
            ))
          }
        </StateConsumer>
      </div>
    );
  }
}

export default withStyles(styles)(CommandsContainer);
