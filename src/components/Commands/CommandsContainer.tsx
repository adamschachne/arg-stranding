import React from "react";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import { AutoSizer } from "react-virtualized/dist/es/AutoSizer";
import { List } from "react-virtualized/dist/es/List";
import { StateConsumer } from "../State";
import Command from "./Command";
import SmartList from "./SmartList";
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

  list: List | null = null;

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
        <StateConsumer>
          {({ items }) => (
            <AutoSizer>
              {({ height, width }) => {
                return (
                  // <SmartList
                  //   width={width}
                  //   height={height}
                  //   rowHeight={200}
                  //   rowCount={items.length}
                  //   rowRenderer={({ key, index, style }: any) => (
                  //     <div style={style} key={key}>
                  //       <Command item={items[index]} />
                  //     </div>
                  //   )}
                  // />
                  <List
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
            // items.map((item, index) => (
            //   <div key={item.id} className={index > 0 ? classes.spaceBefore : ""}>
            //     <Command item={item} />
            //   </div>
            // ))
          )}
        </StateConsumer>
      </div>
    );
  }
}

export default withStyles(styles)(CommandsContainer);
