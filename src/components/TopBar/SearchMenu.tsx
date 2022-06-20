import React from "react";
import { GetMenuPropsOptions, GetItemPropsOptions } from "downshift";
import { Paper, Portal, MenuItem, Backdrop, WithStyles } from "@material-ui/core";
import { Index } from "flexsearch";
import { AutoSizer } from "react-virtualized/dist/es/AutoSizer";
import { List as VirtualList } from "react-virtualized/dist/es/List";
import classNames from "classnames";
import { FlexItem } from "../State";
import styles from "./styles";
// import SearchItem from "./SearchItem";

const ROW_HEIGHT = 48;

interface Props extends WithStyles<typeof styles> {
  flex: Index<FlexItem>;
  updated: string;
  getMenuProps: (options?: GetMenuPropsOptions) => any;
  getItemProps: (options: GetItemPropsOptions<any>) => any;
  isOpen: boolean;
  inputValue: string | null;
  highlightedIndex: number | null;
  selectedItem: any;
  sidebarOpen: boolean;
}

interface State {
  results: Array<FlexItem>;
}

class SearchMenu extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      results: []
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { inputValue, flex, updated } = this.props;
    const { inputValue: prevInputValue, updated: prevUpdated } = prevProps;

    // perform search when inputValue changes
    if (inputValue !== prevInputValue || updated !== prevUpdated) {
      flex.search(
        {
          query: inputValue || ""
        },
        (results) => {
          const { inputValue: value } = this.props;
          if (value === inputValue) {
            // results only get set if the inputValue is the same as what was searched for
            this.setState({ results });
          }
        }
      );
    }
  }

  render() {
    const {
      getMenuProps,
      getItemProps,
      isOpen,
      classes,
      highlightedIndex,
      selectedItem,
      sidebarOpen
    } = this.props;
    const { results } = this.state;

    return (
      <Portal>
        <Backdrop className={classes.backdrop} open={isOpen} />
        <div className={classes.menuRoot}>
          {isOpen && (
            <Paper
              square
              component="div"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...getMenuProps({
                className: classNames(classes.menuPaper, sidebarOpen && classes.menuPaperShifted),
                // clicking doesnt blur input
                onMouseDown: (e) => e.preventDefault()
              })}
            >
              <AutoSizer disableHeight>
                {({ width }) => {
                  return (
                    <VirtualList
                      width={width}
                      height={results.length < 5 ? ROW_HEIGHT * results.length : ROW_HEIGHT * 5}
                      rowHeight={ROW_HEIGHT}
                      rowCount={results.length}
                      scrollToIndex={highlightedIndex || 0}
                      rowRenderer={({ key, index, style }) => {
                        const result = results[index];
                        const highlighted = highlightedIndex === index;
                        const isSelected = selectedItem === result.id;
                        return (
                          <MenuItem
                            key={key}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...getItemProps({
                              item: result,
                              index,
                              selected: highlighted,
                              style: {
                                ...style,
                                fontWeight: isSelected ? 500 : undefined
                              }
                            })}
                          >
                            {result.filename}
                          </MenuItem>
                        );
                      }}
                    />
                  );
                }}
              </AutoSizer>
            </Paper>
          )}
        </div>
      </Portal>
    );
  }
}

export default SearchMenu;
