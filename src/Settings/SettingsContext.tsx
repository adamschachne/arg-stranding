import React, { Component } from "react";

interface ISettingsContext {
  openSettings: () => void;
  closeSettings: () => void;
  isOpen: boolean;
}

const defaultContext: ISettingsContext = {
  openSettings: () => undefined,
  closeSettings: () => undefined,
  isOpen: false
};

const { Provider, Consumer } = React.createContext<ISettingsContext>(defaultContext);

export class SettingsProvider extends Component {
  state = {
    isOpen: false
  };

  openSettings = () => {
    this.setState({ isOpen: true });
  };

  closeSettings = () => this.setState({ isOpen: false });

  render() {
    const { children } = this.props;
    const { isOpen } = this.state;
    console.log(isOpen ? "settings open" : "settings closed");
    return (
      <Provider
        value={{
          openSettings: this.openSettings,
          closeSettings: this.closeSettings,
          isOpen
        }}
      >
        {children}
        {/* <Settings /> */}
      </Provider>
    );
  }
}

export const SettingsConsumer = Consumer;
