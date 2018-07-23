import React, { PureComponent } from 'react';
import PropTypes from "prop-types";
import Graph from "./Graph";
import { createOptions, createEvents } from './config';
import { connect } from 'tls';

class NetworkContainer extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      graph: {
        nodes: [],
        edges: []
      },
      commandToID: {}
    }
    this.network = null;
  }

  updateNetwork = (network) => {
    console.log(network);
    this.network = network;
    network.moveTo({
      animation: true,
      position: { x: 0, y: 0 },
      scale: 0.30,
      offset: { x: 0, y: 0 },
      animation: true
    });
    network.once("stabilized", function () {
      // network.fit({
      //   animation: true
      // });
      // console.log(arguments);
      console.log("stabilized")
    });
  }

  componentDidMount() {
    fetch('/data')
      .then(value => {
        return value.json();
      })
      .then(items => {
        let commandToID = {};
        let nodes = [];
        let edges = [];

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
            image: item.static
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
      })
      .catch(err => {
        // eslint-disable-next-line
        console.log(err);
      })
  }

  componentDidUpdate() {
    const focusNode = this.props.focus;
    if (focusNode !== "" && this.network) {
      this.network.focus(focusNode, {
        scale: 1,
        locked: false,
        animation: true
      });
    }
  }

  render() {
    console.log("Network called render", this.state);
    const options = createOptions(this.props.width, this.props.height);
    const events = createEvents({ unfocusNode: this.props.unfocus });
    return (
      <Graph
        getNetwork={this.updateNetwork}
        graph={this.state.graph}
        options={options}
        events={events}
      />
    );
  }
}

NetworkContainer.propTypes = {
  unfocus: PropTypes.func,
  focus: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};

export default NetworkContainer;
