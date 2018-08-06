import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Graph from "./Graph";
import { initOptions } from "./config";
import localForage from "localforage";
import copy from 'copy-to-clipboard';
import Loader from './Loader';
import buildGraph from './buildGraph';

class NetworkContainer extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      graph: {
        nodes: [],
        edges: []
      },
      options: initOptions(this.props.width, this.props.height),
      commandToID: {},
      loading: true,
      focusNode: null
    }
    this.searchRef = React.createRef();
    this.dragging = false;
    this.network = null;
    this.events = {
      dragStart: () => {
        console.log("dragging");
        this.dragging = true;
        // this.props.unfocus();
        this.interactNetwork();
      },
      // deselectNode: () => {
      //   // this.props.unfocus();
      //   this.interactNetwork();
      // },
      dragEnd: () => {
        console.log("done dragging");
        this.dragging = false;
      },
      stabilized: () => {
        if (this.dragging === true) {
          return;
        }
        localForage.setItem("positions", this.network.getPositions());
        // save positions
        console.log("setting positions")
      },
      click: e => {
        this.interactNetwork(e.nodes);
      },
      doubleClick: doubleClick => {
        console.log(doubleClick);
        if (doubleClick.nodes.length > 0) {
          const label = this.state.graph.nodes[doubleClick.nodes[0]].label;
          const command = label.split("\n")[0];
          console.log("copied: ", command);
          copy(command);
        }
      }
    }
  }

  interactNetwork = (event) => {
    if (event) {
      if (event.length === 1 && this.state.focus !== event[0]) {
        this.setState({ focusNode: event[0] });
      } else if (this.state.focusNode !== null) {
        this.setState({ focusNode: null });
      }
    }
    this.searchRef.current.blur();
  }

  updateNetwork = (network) => {
    console.log(network);
    this.network = network;
    network.once("stabilized", () => {

      console.log("stabilized");
      console.log(performance.now());

      this.network.moveTo({
        animation: false,
        position: { x: 0, y: 0 },
        scale: 0.30,
        offset: { x: 0, y: 0 }
      });

      const nodes = this.state.graph.nodes.map(node => {
        const newNode = {
          ...node
        };
        newNode.hidden = false;
        return newNode;
      });

      // replace reference to options instead of mutate it 
      // so that Graph can compare references and update
      this.setState({
        graph: {
          nodes,
          edges: this.state.graph.edges
        },
        options: {
          ...this.state.options,
          physics: {
            ...this.state.options.physics,
            enabled: true
          }
        },
        loading: false
      });
    });
  }

  componentDidMount() {
    fetch('/data').then(value => {
      return value.json();
    }).then(data => {
      // data.graph, data.updated
      console.log(data);
      console.log(new Date(data.updated).getTime());
      localForage.getItem("updated").then(lastUpdated => {
        console.log("stored update: ", new Date(lastUpdated).getTime())
        if (lastUpdated && lastUpdated === data.updated) {
          // get data from localforage and use those positions
          localForage.getItem("positions").then(positions => {
            console.log("USING EXISTING POSITIONS: ", positions);
            data.items.forEach((item, ID) => {
              Object.assign(item, positions[ID]);
            })
            this.setState(buildGraph(data));
          });
        } else {
          console.log("Sheet updated. Building new graph");
          this.setState(buildGraph(data));
        }
      }).catch(err => {
        console.error(err);
        this.setState(buildGraph(data));
      })
    });
  }

  componentDidUpdate(prevProps) {
    console.log("NETWORK UPDATE", this.props);
    const focusNode = this.state.focusNode;
    if (focusNode && this.network) {
      this.network.focus(focusNode, {
        scale: 1,
        locked: false,
        animation: true
      });
    }
  }

  render() {
    // console.log("Network called render", this.state);
    return (
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Loader loading={this.state.loading} />
        {/* MENU */}
        {this.props.renderMenu({
          searchRef: this.searchRef,
          nodes: this.state.graph.nodes,
          loading: this.state.loading
        })}
        <Graph
          getNetwork={this.updateNetwork}
          graph={this.state.graph}
          options={{
            ...this.state.options,
            width: this.props.width + "px",
            height: this.props.height + "px",
          }}
          events={this.events}
        />
      </div>
    );
  }
}

NetworkContainer.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  renderMenu: PropTypes.func.isRequired
};

export default NetworkContainer;
