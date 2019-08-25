import React, { RefObject } from "react";
import Downshift from "downshift";
import classNames from "classnames";
import { WithStyles } from "@material-ui/styles";
import SearchIcon from "@material-ui/icons/Search";
import { InputBase } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import styles from "./styles";
import SearchMenu from "./SearchMenu";
import { StateConsumer, FlexItem } from "../State";

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  inputRef: RefObject<HTMLInputElement>;
  sidebarOpen: boolean;
}

interface State {
  open: Boolean;
}

class Search extends React.Component<Props, State> {
  blurInput() {
    // since this is only called from downshift setState,
    // defer it to end of the event loop
    setTimeout(() => {
      const { inputRef } = this.props;
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }, 0);
  }

  render() {
    const {
      inputRef,
      classes,
      sidebarOpen,
      history,
      location: { pathname }
    } = this.props;
    // const { open } = this.state;
    return (
      <Downshift
        onChange={(selection: FlexItem | null) => {
          if (selection !== null) {
            // do something with selection
            if (pathname.startsWith("/graph")) {
              history.push(`/graph/${selection.id}`);
            } else {
              history.push(`/commands/${selection.id}`);
            }
          }
          // if (current === null) return;
          // blur which closes and clears the menu
          // current.blur();
        }}
        itemToString={(item: FlexItem) => (item ? item.command : "")}
        stateReducer={(state, changes) => {
          console.log(changes.type, state);
          // Do not clear search input content on blur
          switch (changes.type) {
            case Downshift.stateChangeTypes.keyDownEscape:
              // this.blurInput();
              return { ...state, ...changes, isOpen: true };
            case Downshift.stateChangeTypes.clickItem:
            case Downshift.stateChangeTypes.keyDownEnter:
              this.blurInput();
              return { ...state, ...changes };
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
          clearSelection,
          setState
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
                      // this.setState({ open: true });
                      setState({ isOpen: true });
                      // commented line highlights the input text
                      target.select();
                    },
                    onBlur: () => {
                      const {
                        inputRef: { current }
                      } = this.props;
                      // only clear if the blur was not caused by alt-tab
                      if (current === null || current !== document.activeElement) {
                        clearSelection();
                        // this.setState({ open: false });
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

export default withRouter(Search);
