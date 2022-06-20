import React from "react";
import { Hidden, Theme, Typography, WithStyles } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/styles";
import Scrollbars from "react-custom-scrollbars";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
      // flexGrow: 1
      // alignItems: "center"
    },
    header: {
      minWidth: 80,
      fontWeight: 600
    },
    rowContent: {
      flexGrow: 1,
      overflowX: "hidden"
      // maxWidth: "100%"
      // height: "100%"
    },
    scroll: {
      whiteSpace: "nowrap",
      "& p:not(:last-child),a:not(:last-child)": {
        marginRight: 5
      }
    }
  });

interface Props extends WithStyles<typeof styles> {
  header: string;
  children: React.ReactNode;
}

const DetailRow = (props: Props) => {
  const { header, children, classes } = props;
  return (
    <div className={classes.root}>
      <Hidden xsDown>
        <Typography variant="body2" className={classes.header}>
          {header}
        </Typography>
      </Hidden>

      <div className={classes.rowContent}>
        <Scrollbars style={{ height: 34 }} className={classes.scroll}>
          {children}
        </Scrollbars>
      </div>
    </div>
  );
};

export default withStyles(styles)(DetailRow);
