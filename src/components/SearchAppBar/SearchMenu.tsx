import React from "react";
import { GetMenuPropsOptions, GetItemPropsOptions } from "downshift";
import { Paper, Portal, MenuItem } from "@material-ui/core";
import { WithStyles } from "@material-ui/styles";
import { Index } from "flexsearch";
import { AutoSizer } from "react-virtualized/dist/es/AutoSizer";
import { List as VirtualList } from "react-virtualized/dist/es/List";
import classNames from "classnames";
import { FlexItem } from "../State";
import styles from "./styles";
import SearchItem from "./SearchItem";

const ROW_HEIGHT = 48;

interface Props extends WithStyles<typeof styles> {
  flex: Index<FlexItem>;
  getMenuProps: (options?: GetMenuPropsOptions) => any;
  getItemProps: (options: GetItemPropsOptions<any>) => any;
  isOpen: boolean;
  inputValue: string | null;
  highlightedIndex: number | null;
  selectedItem: any;
}

interface State {
  results: Array<FlexItem>;
}

class SearchMenu extends React.PureComponent<Props, State> {
  state: State = {
    results: []
  };

  componentDidUpdate(prevProps: Props) {
    const { inputValue, flex } = this.props;
    const { inputValue: prevInputValue } = prevProps;

    // perform search when inputValue changes
    if (inputValue !== prevInputValue) {
      flex.search(
        {
          query: inputValue || ""
        },
        (results) => {
          const { inputValue: value } = this.props;
          console.log(results);
          if (value === inputValue) {
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
      selectedItem
    } = this.props;
    const { results } = this.state;

    let rootProps = {};

    if (isOpen) {
      rootProps = getMenuProps({
        style: { position: "absolute", top: 48, left: 0 },
        className: classes.menuRoot
      });
    }

    return (
      <Portal>
        <>
          <div {...rootProps}>
            <Paper
              square
              style={{
                marginTop: 8,
                // width: popperNode ? popperNode.clientWidth : undefined
                width: 200
                // height: 500
              }}
              // clicking doesnt blur input
              onMouseDown={(e) => e.preventDefault()}
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
                          // <SearchItem
                          //   key={key}
                          //   itemProps={getItemProps({
                          //     item: result.id,
                          //     index,
                          //     style
                          //   })}
                          //   selected={selected}
                          //   highlighted={highlighted}
                          //   result={result}
                          // />
                          <MenuItem
                            key={key}
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
          </div>
          <div
            role="presentation"
            className={classNames(classes.back, isOpen ? classes.fade : classes.noPointerEvents)}
          />
        </>
      </Portal>
    );
  }
}

export default SearchMenu;

// <div
//   {...getMenuProps({
//     style: {
//       height: ROW_HEIGHT * 5,
//       position: "absolute"
//     }
//   })}
// >
//   {isOpen && results.length > 0 && (
//     <>
//       <Paper style={{ backgroundColor: "white" }} square>
//         {results.map((_, index) => (
//           <SearchItem
//             key={_.id}
//             itemProps={getItemProps({
//               item: results[index],
//               index,
//               style: {
//                 color: "black"
//               }
//             })}
//             label={results[index].command}
//           />
//         ))}
//       </Paper>
//       {/* <div role="presentation" className={classes.backfade} /> */}
//     </>
//   )}
// </div>
