import React from "react";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import { AutoSizer } from "react-virtualized/dist/es/AutoSizer";
import { List as VirtualList } from "react-virtualized";
import { matchPath, RouteComponentProps, withRouter } from "react-router-dom";
import { Item, StateConsumer } from "../State";
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

interface Props extends WithStyles<typeof styles>, RouteComponentProps {}

// container for all commands
class CommandsContainer extends React.PureComponent<Props> {
  list: VirtualList | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.list !== null && this.list.Grid !== null) {
      console.log(this.list.Grid);
    }
  }

  getFocusedCommandIndex = (items: Item[]): number => {
    const {
      location: { pathname }
    } = this.props;

    const match = matchPath<{ id: string }>(pathname, {
      path: "/commands/:id"
    });

    const params = match?.params;
    if (params) {
      const { id } = params;
      return items.findIndex((item) => item.id === id) ?? 0;
    }

    return 0;
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
                  <VirtualList
                    rowHeight={280}
                    rowCount={items.length}
                    scrollToAlignment="center"
                    scrollToIndex={this.getFocusedCommandIndex(items)}
                    rowRenderer={({ key, index, style }) => (
                      <div style={style} key={key}>
                        <Command height={Number(style.height)} item={items[index]} />
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

export default withStyles(styles)(withRouter(CommandsContainer));
