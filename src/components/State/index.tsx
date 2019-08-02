import React, { Component } from "react";
import FlexSearch, { Index } from "flexsearch";

export interface Item {
  actualSize: string;
  bruteforce: boolean;
  command: Array<string>;
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
}
export interface FlexItem extends Omit<Item, "command"> {
  flexId: number;
  command: string;
}

const initialState = {
  items: [] as Array<Item>,
  // identity: null as Identity | null,
  updated: ""
};

const initialContext = Object.assign(
  {
    // setIdentity: (identity: Identity) => {}
    flex: {} as Index<FlexItem>
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
  flex = FlexSearch.create<FlexItem>({
    doc: {
      id: "flexId", // the property containing this object's id
      field: ["command", "description"] // the properties to index this object by
    }
  });

  componentDidMount = async () => {
    try {
      // TODO provide a system for updating
      const dataResponse = await fetch("data");
      const data: { items: Array<Item>; updated: string } = await dataResponse.json();
      data.items.forEach((item, index) => {
        this.flex.add({
          ...item,
          flexId: index,
          command: item.command.join(" "), // combine all commands into one string so any can be searched
          description: "this is a description" // adding in the description
        });
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
      ...this.state,
      flex: this.flex
      // setIdentity: this.setIdentity
    };
    return <Provider value={value}>{children}</Provider>;
  }
}

export const StateConsumer = Consumer;
