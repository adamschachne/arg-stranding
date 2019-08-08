import React, { RefObject } from "react";
import Downshift from "downshift";
import classNames from "classnames";
import { WithStyles } from "@material-ui/styles";
import SearchIcon from "@material-ui/icons/Search";
import { InputBase, TextField } from "@material-ui/core";
import styles from "./styles";
import SearchMenu from "./SearchMenu";
import { StateConsumer, FlexItem } from "../State";

interface Props extends WithStyles<typeof styles> {
  inputRef: RefObject<HTMLInputElement>;
}

interface State {
  open: Boolean;
}

class Search extends React.Component<Props, State> {
  state = {
    open: false
  };

  render() {
    const { inputRef, classes } = this.props;
    const { open } = this.state;
    return (
      <Downshift
        isOpen={open}
        onChange={(selection: FlexItem) => {
          console.log(`You selected ${selection ? selection.command : ""}`);
          const { current } = inputRef;

          if (current !== null) {
            if (!selection) {
              current.blur();
            } else {
              current.select();
            }
          }
        }}
        itemToString={(item: FlexItem) => {
          console.log(item);
          return item.command;
        }}
        stateReducer={(state, changes) => {
          // Do not clear search input content on blur
          switch (changes.type) {
            case Downshift.stateChangeTypes.blurInput:
              return state;
            case Downshift.stateChangeTypes.keyDownEscape:
              if (inputRef.current !== null) {
                inputRef.current.blur();
              }
              return { ...state, ...changes, selectedItem: state.selectedItem };
            default:
              return { ...state, ...changes };
          }
        }}
      >
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectedItem
        }) => {
          return (
            <div className={classNames(classes.allPointerEvents, classes.search)}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <div>
                <InputBase
                  inputRef={inputRef}
                  classes={{
                    root: classes.inputRoot,
                    input: classNames(classes.inputInput, isOpen && classes.inputInputFocused)
                  }}
                  inputProps={getInputProps({
                    placeholder: "Search…",
                    onFocus: ({ target }: React.FocusEvent<HTMLInputElement>) => {
                      // this.hasFocus = true;
                      this.setState({ open: true });
                      target.select();
                    },
                    onBlur: () => {
                      const {
                        inputRef: { current }
                      } = this.props;
                      if (current === null || current !== document.activeElement) {
                        console.log(current, document.activeElement, "blur");
                        this.setState({ open: false });
                      }
                    }
                  })}
                />
                <StateConsumer>
                  {({ flex }) => (
                    <SearchMenu
                      classes={classes}
                      flex={flex}
                      isOpen={isOpen}
                      getMenuProps={getMenuProps}
                      getItemProps={getItemProps}
                      inputValue={inputValue}
                      highlightedIndex={highlightedIndex}
                      selectedItem={selectedItem}
                    />
                  )}
                </StateConsumer>
              </div>
            </div>
          );
        }}
      </Downshift>
    );
  }
}

export default Search;
