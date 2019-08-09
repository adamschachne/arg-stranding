import React, { RefObject } from "react";
import Downshift from "downshift";
import classNames from "classnames";
import { WithStyles } from "@material-ui/styles";
import SearchIcon from "@material-ui/icons/Search";
import { InputBase } from "@material-ui/core";
import styles from "./styles";
import SearchMenu from "./SearchMenu";
import { StateConsumer, FlexItem } from "../State";

interface Props extends WithStyles<typeof styles> {
  inputRef: RefObject<HTMLInputElement>;
  sidebarOpen: boolean;
}

interface State {
  open: Boolean;
}

class Search extends React.Component<Props, State> {
  state = {
    open: false
  };

  render() {
    const { inputRef, classes, sidebarOpen } = this.props;
    const { open } = this.state;
    return (
      <Downshift
        isOpen={open}
        onChange={(selection: FlexItem | null) => {
          const { current } = inputRef;

          // do something with selection
          if (selection !== null) {
            console.log(selection);
          }

          if (current === null) return;

          current.blur();

          // current.blur();
          // if (!selection) {
          //   current.blur();
          // } else {
          //   current.select();
          // }
        }}
        itemToString={(item: FlexItem) => (item ? item.command : "")}
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
          selectedItem,
          clearSelection
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

                      // only clear if the blur was not caused by alt-tab
                      if (current === null || current !== document.activeElement) {
                        clearSelection();
                        this.setState({ open: false });
                      }
                    }
                  })}
                />
                <StateConsumer>
                  {({ flex, updated }) => (
                    <SearchMenu
                      classes={classes}
                      flex={flex}
                      updated={updated}
                      isOpen={isOpen}
                      getMenuProps={getMenuProps}
                      getItemProps={getItemProps}
                      inputValue={inputValue}
                      highlightedIndex={highlightedIndex}
                      selectedItem={selectedItem}
                      sidebarOpen={sidebarOpen}
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
