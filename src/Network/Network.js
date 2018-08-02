import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Graph from "./Graph";
import { initOptions } from "./config";
import localForage from "localforage";
import Loader from './Loader';
class NetworkContainer extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      graph: {
        nodes: [],
        edges: []
      },
      commandToID: {},
      loading: true
    }
    this.dragging = false;
    this.options = initOptions(this.props.width, this.props.height);
    // this.events = createEvents({ unfocusNode: this.props.unfocus });
    this.events = {
      dragStart: () => {
        console.log("dragging");
        this.dragging = true;
        this.props.unfocus();
      },
      deselectNode: () => {
        this.props.unfocus();
      },
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
      // stabilizationProgress: ({ iterations, total }) => {
      //   console.log("stabilization progress", iterations, total);
      // },
      // stabilizationIterationsDone: function() {
      //   console.log("stabilization Iterations done", arguments);
      // }
    }
    this.network = null;
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

      // replace reference to options instead of mutate it 
      // so that Graph can compare references and update
      this.options = {
        ...this.options,
        physics: {
          ...this.options.physics,
          enabled: true
        }
      };
      this.setState({
        graph: {
          nodes: this.state.graph.nodes.map(node => {
            const newNode = {
              ...node
            };
            newNode.hidden = false;
            return newNode;
          }),
          edges: this.state.graph.edges
        },
        loading: false
      });
    });
  }

  buildGraph = ({ items, updated }) => {
    console.log("building graph");
    let commandToID = {};
    let nodes = [];
    let edges = [];

    localForage.setItem("updated", updated);

    // iterate through each image once to generate mappings
    items.forEach((item, index) => {
      // each command in that image
      item.command.forEach(cmd => {
        // map the command name to the ID (index)
        commandToID[cmd] = index;
      });
    });

    // iterate again to generate nodes and edges
    items.forEach((item, ID) => {
      // nodes
      nodes.push({
        id: ID,
        label: item.command.length === 1 ? item.command[0] : item.command.join("\n"),
        shape: "circularImage",
        image: item.static,
        hidden: true,
        x: item.x,
        y: item.y
      });
      // outgoing edges for this node
      item.leadsto.forEach(toNode => {
        const connectedID = commandToID[toNode];
        if (connectedID) {
          edges.push({ from: ID, to: connectedID });
        }
      });
    })

    const graph = {
      nodes,
      edges
    };

    this.setState({ graph, commandToID });
  }

  componentDidMount() {
    fetch('/data').then(value => {
      return value.json();
    }).then(data => {
      // data.graph, data.updated
      localForage.getItem("updated").then(lastUpdated => {
        if (lastUpdated && lastUpdated === data.updated) {
          // get data from localforage and use those positions
          localForage.getItem("positions").then(positions => {
            console.log("USING EXISTING POSITIONS: ", positions);
            data.items.forEach((item, ID) => {
              Object.assign(item, positions[ID]);
            })
            this.buildGraph(data);
          });
        } else {
          this.buildGraph(data);
        }
      }).catch(err => {
        console.error(err);
        this.buildGraph(data);
      })
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) {
      this.options.width = this.props.width + "px";
      this.options.height = this.props.height + "px";
      this.network.setOptions(this.options);
    }
    const focusNode = this.props.focus;
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

        <Graph
          getNetwork={this.updateNetwork}
          graph={this.state.graph}
          options={this.options}
          events={this.events}
        />
      </div>
    );
  }
}

NetworkContainer.propTypes = {
  setfocus: PropTypes.func,
  unfocus: PropTypes.func,
  focus: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};

export default NetworkContainer;
