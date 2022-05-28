import { PaletteType } from "@material-ui/core";
import React, { Component } from "react";

interface State {
  isOpen: boolean;
  themeType: PaletteType;
  openSettings: () => void;
  closeSettings: () => void;
  changeTheme: () => void;
}

const initialState: State = {
  isOpen: false,
  themeType: "dark" as PaletteType,
  openSettings: () => {},
  closeSettings: () => {},
  changeTheme: () => {}
};

const { Provider, Consumer } = React.createContext<State>(initialState);
/* eslint-disable react/no-unused-state */
export class SettingsProvider extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      ...initialState,
      openSettings: () => this.setState({ isOpen: true }),
      closeSettings: () => this.setState({ isOpen: false }),
      changeTheme: () =>
        this.setState((currentState) => ({
          themeType: currentState.themeType === "dark" ? "light" : "dark"
        }))
    };
  }

  render() {
    const { children } = this.props;
    return <Provider value={this.state}>{children}</Provider>;
  }
}

export const SettingsConsumer = Consumer;
