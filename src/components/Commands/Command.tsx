import React, { useState } from "react";
import {
  Paper,
  createStyles,
  Theme,
  withStyles,
  Grid,
  Button,
  Typography
} from "@material-ui/core";
import { WithStyles } from "@material-ui/styles";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { Item } from "../State";
import DetailRow from "./DetailRow";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      height: "calc(100% - 24px)",
      margin: 12
    },
    image: {
      height: "100%",
      width: "100%", // maxWidth: 100%
      objectFit: "cover"
    },
    gridItem: {
      height: "100%",
      padding: 10
    },
    details: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly"
    },
    leads: {
      display: "flex",
      flexDirection: "row",
      gap: "10px"
    },
    leadsButton: {
      textTransform: "none",
      padding: "1px 4px"
    }
  });

interface CommandProps extends WithStyles<typeof styles> {
  item: Item;
  height: number;
}

// eslint-disable-next-line complexity
const Command: React.FunctionComponent<CommandProps> = ({ item, classes, height }) => {
  const [hover, setHover] = useState(false);

  return (
    <Paper
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onClick={() =>
        window.history.replaceState(null, window.document.title, `/commands/${item.id}`)
      }
      square={false}
      elevation={hover ? 20 : 1}
      className={classes.root}
    >
      <Grid style={{ height: "100%", width: "100%" }} container>
        <Grid style={{ maxWidth: height }} item xs={4} className={classes.gridItem}>
          <img alt={item.filename} src={item.url} className={classes.image} />
        </Grid>
        <Grid item className={classNames(classes.gridItem, classes.details)}>
          <DetailRow header="filename">
            <Typography variant="body2">{item.filename}</Typography>
          </DetailRow>
          <DetailRow header={item.command.length > 1 ? "commands" : "command"}>
            {item.command.map((command) => (
              <Typography key={command} display="inline" variant="body2">
                {command}
              </Typography>
            ))}
          </DetailRow>
          {item.leadsto.length > 0 && (
            <DetailRow header="leads to">
              {item.leadsto.map((lead) => (
                <Button
                  component={Link}
                  to={`/commands/${lead.id}`}
                  classes={{ root: classes.leadsButton }}
                  size="small"
                  variant="outlined"
                  key={lead.command}
                >
                  {lead.command}
                </Button>
              ))}
            </DetailRow>
          )}
          <DetailRow header="url">
            <Typography variant="body2">{item.url}</Typography>
          </DetailRow>
          <DetailRow header="id">
            <Typography variant="body2">{item.id}</Typography>
          </DetailRow>
          {item.width !== undefined && (
            <DetailRow header="dimensions">
              <Typography variant="body2">
                {item.width}x{item.height}
              </Typography>
            </DetailRow>
          )}
          {item.fannames.length > 0 && (
            <DetailRow header="other names">
              {item.fannames.map((fanname) => (
                <Typography key={fanname} display="inline" variant="body2">
                  {fanname}
                </Typography>
              ))}
            </DetailRow>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default withStyles(styles)(Command);
