import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Graph from "./Graph";
import { initOptions } from "./config";
import localForage from "localforage";
import copy from 'copy-to-clipboard';
import Loader from './Loader';

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
      loading: true
    }
    this.dragging = false;
    this.events = {
      dragStart: () => {
        console.log("dragging");
        this.dragging = true;
        // this.props.unfocus();
        this.props.interactNetwork();
      },
      // deselectNode: () => {
      //   // this.props.unfocus();
      //   this.props.interactNetwork();
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
        this.props.interactNetwork(e.nodes);
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
      const UNKNOWN_COMMAND = item.command[0].charAt(0) !== "?";
      // nodes            
      nodes.push({
        id: ID,
        label: item.command.length === 1 ? item.command[0] : item.command.join("\n"),
        shape: UNKNOWN_COMMAND ? "image" : "circularImage",
        image: item.static,        
        borderWidth: 3,
        size: UNKNOWN_COMMAND ? 20 : 25,
        hidden: true,
        x: item.x,
        y: item.y,
        shapeProperties: {
          useBorderWithImage: true,
          interpolation: false
        }
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
            this.buildGraph(data);
          });
        } else {
          console.log("Sheet updated. Building new graph");
          this.buildGraph(data);                    
        }
      }).catch(err => {
        console.error(err);
        this.buildGraph(data);
      })
    });
  }

  componentDidUpdate(prevProps) {
    // if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) {
    //   this.options.width = this.props.width + "px";
    //   this.options.height = this.props.height + "px";
    //   this.network.setOptions(this.options);
    // }
    console.log("NETWORK UPDATE", this.props);
    const focusNode = this.props.focusNode;
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
  interactNetwork: PropTypes.func.isRequired,
  focusNode: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  renderSearch: PropTypes.func
};

export default NetworkContainer;
