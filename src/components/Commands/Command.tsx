import React from "react";
import { Paper, createStyles, Theme, withStyles, Grid } from "@material-ui/core";
import { WithStyles } from "@material-ui/styles";
import { Item } from "../State";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%"
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "contain"
    }
  });

interface CommandProps extends WithStyles<typeof styles> {
  item: Item;
}

const Command: React.SFC<CommandProps> = ({ item, classes }) => {
  return (
    <Paper className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <img alt={item.filename} src={item.url} className={classes.image} />
        </Grid>
        <Grid item xs={8}>
          {item.command.map((cmd) => (
            <div key={cmd}>{item.command[0]}</div>
          ))}
          <div>{item.filename}</div>
          <div>
            <a style={{ color: "white" }} href={item.url}>
              {item.url}
            </a>
          </div>
          <div>{`${item.width}x${item.height}`}</div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default withStyles(styles)(Command);
