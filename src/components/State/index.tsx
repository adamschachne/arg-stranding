import React, { Component } from "react";
import FlexSearch from "flexsearch";
import { withRouter, RouteComponentProps } from "react-router-dom";

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
  updated: "",
  flex: FlexSearch.create<FlexItem>({
    doc: {
      id: "flexId", // the property containing this object's id
      field: ["command", "description", "filename"] // the properties to index this object by
    }
  })
};

type State = typeof initialState;

interface Props extends RouteComponentProps {
  children: React.ElementType;
}

const { Provider, Consumer } = React.createContext<State>(initialState);

class StateProvider extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

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

  // eslint-disable-next-line complexity
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { updated } = this.state;
    if (updated !== nextState.updated) {
      return true;
    }

    /* eslint-disable no-continue */
    for (const key of Object.keys(this.props)) {
      if (key === "match") continue; // don't care about match
      // @ts-ignore
      const { [key]: prop } = this.props;
      // @ts-ignore
      if (prop !== nextProps[key]) {
        // handle location specifically
        if (key === "location") {
          if (prop.pathname === nextProps[key].pathname) {
            continue;
          }
        }
        return true;
      }
    }
    /* eslint-enable no-continue */
    return false;
  }

  componentDidMount = async () => {
    try {
      const { flex } = this.state;
      // TODO provide a system for fetching new data
      const dataResponse = await fetch("/data");
      const data: { items: Array<Item>; updated: string } = await dataResponse.json();
      data.items.forEach((item, index) => {
        flex.add({
          ...item,
          flexId: index,
          command: item.command.join(" "), // combine command into one string so any can be searched
          description: "this is a description" // adding in the description
        });
      });
      console.log(flex);
      // eslint-disable-next-line react/no-unused-state
      this.setState({ items: data.items, updated: data.updated });
    } catch (err) {
      console.error(err);
    }
  };

  // setIdentity = (identity: Identity) => this.setState({ identity });

  render() {
    const { children } = this.props;
    return <Provider value={this.state}>{children}</Provider>;
  }
}

const ProviderWithRouter = withRouter(StateProvider);
export { ProviderWithRouter as StateProvider };
export const StateConsumer = Consumer;
