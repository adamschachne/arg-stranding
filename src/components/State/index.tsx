import React, { Component } from "react";

// interface Identity {
//   : string;
// }

interface Item {}

const initialState = {
  items: [] as Array<Item>,
  // identity: null as Identity | null,
  updated: ""
};

const initialContext = Object.assign(
  {
    // setIdentity: (identity: Identity) => {}
  },
  initialState
);
type State = typeof initialState;
type Context = typeof initialContext;

const { Provider, Consumer } = React.createContext<Context>(initialContext);

export class StateProvider extends Component {
  readonly state: State = initialState;

  componentDidMount = async () => {
    try {
      // TODO provide a system for updating
      const dataResponse = await fetch("data");
      const data: { items: Array<Item>; updated: string } = await dataResponse.json();
      this.setState({ items: data.items, updated: data.updated });
    } catch (err) {
      console.error(err);
      this.setState({ loading: false });
    }
  };

  // setIdentity = (identity: Identity) => this.setState({ identity });

  render() {
    const { children } = this.props;
    const value: Context = {
      ...this.state
      // setIdentity: this.setIdentity
    };
    return <Provider value={value}>{children}</Provider>;
  }
}

export const StateConsumer = Consumer;
