import React from "react";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import { AutoSizer } from "react-virtualized/dist/es/AutoSizer";
import { List as VirtualList } from "react-virtualized/dist/es/List";
import { Route, Switch } from "react-router-dom";
import { StateConsumer } from "../State";
import Command from "./Command";
// import SmartList from "./SmartList";
// import DemoList from "./DemoList";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      // paddingLeft: theme.spacing(2),
      // paddingTop: theme.spacing(2),
      // paddingBottom: theme.spacing(2),
      display: "flex",
      height: "100%",
      width: "100%",
      overflow: "hidden"
    },
    listPadRight: {
      // paddingRight: theme.spacing(2)
    },
    spaceBefore: {
      marginTop: theme.spacing(1)
    },
    autoSizerContainer: {
      flex: "1 1 auto"
    }
  });

interface Props extends WithStyles<typeof styles> {}

// container for all commands
class CommandsContainer extends React.Component<Props> {
  state = {};

  list: VirtualList | null = null;

  componentDidMount() {
    if (this.list !== null && this.list.Grid !== null) {
      console.log(this.list.Grid);
    }
  }

  // scroll:
  handleScroll = (event: any) => {
    console.log(event);
    // const { scrollTop, scrollLeft } = target;

    // if (this.list !== null) {
    //   this.list.scrollToPosition(scrollTop);
    // }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Switch>
          <Route exact path="awd" component={() => <div>123</div>} />
        </Switch>

        <StateConsumer>
          {({ items }) => (
            <AutoSizer>
              {({ height, width }) => {
                return (
                  <VirtualList
                    rowHeight={200}
                    rowCount={items.length}
                    rowRenderer={({ key, index, style }) => (
                      <div style={style} key={key}>
                        <Command item={items[index]} />
                      </div>
                    )}
                    width={width}
                    height={height}
                    ref={(node) => {
                      this.list = node;
                    }}
                  />
                );
              }}
            </AutoSizer>
          )}
        </StateConsumer>
      </div>
    );
  }
}

export default withStyles(styles)(CommandsContainer);
