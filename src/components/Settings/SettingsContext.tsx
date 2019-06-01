import React, { Component } from "react";

const initialState = {
  isOpen: false,
  themeType: "dark" as "dark" | "light"
};

const initialContext = Object.assign(
  {
    openSettings: () => {},
    closeSettings: () => {},
    switchThemeType: () => {}
  },
  initialState
);

type State = typeof initialState;
type Context = typeof initialContext;
const { Provider, Consumer } = React.createContext<Context>(initialContext);

export class SettingsProvider extends Component {
  readonly state: State = initialState;

  openSettings = () => this.setState({ isOpen: true });

  closeSettings = () => this.setState({ isOpen: false });

  switchThemeType = () =>
    this.setState(({ themeType: oldType }: State) => {
      return { themeType: oldType === "dark" ? "light" : "dark" };
    });

  render() {
    const { children } = this.props;
    const value: Context = {
      ...this.state,
      openSettings: this.openSettings,
      closeSettings: this.closeSettings,
      switchThemeType: this.switchThemeType
    };
    return <Provider value={value}>{children}</Provider>;
  }
}

export const SettingsConsumer = Consumer;
