import React, { Component } from "react";

const initialState = {
  isOpen: false,
  themeType: "dark" as "dark" | "light",
  openSettings: () => {},
  closeSettings: () => {},
  switchThemeType: () => {}
};

type State = typeof initialState;
const { Provider, Consumer } = React.createContext<State>(initialState);

/* eslint-disable react/no-unused-state */

export class SettingsProvider extends Component {
  readonly state: State = Object.assign({}, initialState, {
    openSettings: () => this.setState({ isOpen: true }),
    closeSettings: () => this.setState({ isOpen: false })
  });

  switchThemeType = () =>
    this.setState(({ themeType: oldType }: State) => {
      return { themeType: oldType === "dark" ? "light" : "dark" };
    });

  render() {
    const { children } = this.props;
    return <Provider value={this.state}>{children}</Provider>;
  }
}

export const SettingsConsumer = Consumer;
