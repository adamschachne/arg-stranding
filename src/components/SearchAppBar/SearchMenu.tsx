import React from "react";
import { GetMenuPropsOptions, GetItemPropsOptions } from "downshift";
import { Paper } from "@material-ui/core";
import { WithStyles } from "@material-ui/styles";
import { Index } from "flexsearch";
import { FlexItem } from "../State";
import styles from "../Sidebar/styles";

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
      <div {...getMenuProps({ style: { position: "fixed" } })}>
        {isOpen && (
          <Paper className={classes.paper} square>
            {results.map((suggestion, index) => (
              // renderSuggestion({
              //   suggestion,
              //   index,
              //   itemProps: getItemProps({ item: suggestion.label }),
              //   highlightedIndex,
              //   selectedItem: selectedItem2,
              // })
              <div {...getItemProps({ item: suggestion.id })}>{suggestion.command}</div>
            ))}
          </Paper>
        )
        // items
        //   .filter((item) => !inputValue || item.value.includes(inputValue))
        //   .map((item, index) => (
        //     <div
        //       {...getItemProps({
        //         key: item.value,
        //         index,
        //         item,
        //         style: {
        //           color: "black",
        //           backgroundColor: highlightedIndex === index ? "lightgray" : "white",
        //           fontWeight: selectedItem === item ? "bold" : "normal"
        //         }
        //       })}
        //     >
        //       {item.value}
        //     </div>
        }
      </div>
    );
  }
}

export default SearchMenu;
