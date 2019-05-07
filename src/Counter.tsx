import * as React from "react";

interface State {
  name: string,
  count: number
}

/*
  EXAMPLE TSX COMPONENT
*/

export default class Counter extends React.Component {
  state: State = {
    name: "counter",
    count: 0
  };

  increment = () => {
    this.setState(({ count }: State) => ({
      count: count + 1
    }));
  };

  decrement = () => {
    this.setState(({ count }: State) => ({
      count: count - 1
    }));
  };

  render() {
    const { name, count } = this.state;
    return (
      <div>
        <div>{name}</div>
        <h1>{count}</h1>
        <button type="button" onClick={this.increment}>Increment</button>
        <button type="button" onClick={this.decrement}>Decrement</button>
      </div>
    );
  }
}
