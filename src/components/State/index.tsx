import React, { Component } from "react";
import FlexSearch from "flexsearch";

// interface Identity {
//   : string;
// }

export interface Item {
  actualSize: string;
  bruteforce: boolean;
  command: any;
  fannames: Array<string>;
  filename: string;
  height: number;
  id: string;
  lastModified: string;
  lastModifiedUnix: number;
  leadsto: Array<string>;
  postimgSize: string;
  type: string;
  url: string;
  width: number;
  description?: string;
  flexId?: number;
}

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

  // flex = FlexSearch.create({
  //   async: false,
  //   // worker: 4,
  //   cache: false,
  //   doc: {
  //     id: "id",
  //     field: {
  //       command: {
  //         encode: false,
  //         tokenize: "full",
  //         threshold: 1
  //       },
  //       description: {
  //         encode: false,
  //         tokenize: ""
  //       }
  //     }
  //   }
  // });

  flex = new FlexSearch<Item>({
    doc: {
      id: "flexId",
      field: ["command", "description"]
    }
  });

  componentDidMount = async () => {
    try {
      // TODO provide a system for updating
      const dataResponse = await fetch("data");
      const data: { items: Array<Item>; updated: string } = await dataResponse.json();
      data.items.forEach((item, index) => {
        // replace command with a single string joined by spaces
        this.flex.add({
          ...item,
          flexId: index,
          command: item.command.join(" "),
          description: "this is a description"
        });
        // this.flex.add(index, item.command.join(" "));
      });
      console.log(this.flex);
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
