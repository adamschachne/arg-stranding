import React from "react";
import { GetMenuPropsOptions, GetItemPropsOptions } from "downshift";
import { Paper, Portal } from "@material-ui/core";
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
  popperNode: HTMLElement | null;
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
      popperNode,
      highlightedIndex,
      selectedItem
    } = this.props;
    const { results } = this.state;

    let rootProps = {};

    if (isOpen) {
      rootProps = getMenuProps({
        style: { position: "absolute" },
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
                width: popperNode ? popperNode.clientWidth : undefined
              }}
            >
              {results.map((result, index) => {
                const selected = selectedItem === result.id;
                const highlighted = highlightedIndex === index;
                return (
                  <SearchItem
                    key={result.id}
                    itemProps={getItemProps({
                      item: result.id,
                      index,
                      style: {
                        color: "black"
                      }
                    })}
                    selected={selected}
                    highlighted={highlighted}
                    result={results[index]}
                  />
                );
              })}
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
