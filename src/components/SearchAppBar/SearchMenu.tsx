import React from "react";
import { GetMenuPropsOptions, GetItemPropsOptions } from "downshift";
import { Paper } from "@material-ui/core";
import { WithStyles } from "@material-ui/styles";
import { Index } from "flexsearch";
import { AutoSizer } from "react-virtualized/dist/es/AutoSizer";
import { List as VirtualList } from "react-virtualized/dist/es/List";
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
    const { inputValue, flex } = this.props;
    const { inputValue: prevInputValue } = prevProps;

    // perform search when inputValue changes
    if (inputValue && inputValue !== prevInputValue) {
      flex.search(
        {
          query: inputValue
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
    const { getMenuProps, getItemProps, isOpen, classes } = this.props;
    const { results } = this.state;
    return (
      <div
        {...getMenuProps({
          style: {
            height: ROW_HEIGHT * 5,
            position: "absolute"
          }
        })}
      >
        {isOpen && results.length > 0 && (
          <>
            <Paper style={{ backgroundColor: "white" }} square>
              {results.map((_, index) => (
                <SearchItem
                  key={_.id}
                  itemProps={getItemProps({
                    item: results[index],
                    index,
                    style: {
                      color: "black"
                    }
                  })}
                  label={results[index].command}
                />
              ))}
            </Paper>
            {/* <div role="presentation" className={classes.backfade} /> */}
          </>
        )}
      </div>
    );
  }
}

export default SearchMenu;
