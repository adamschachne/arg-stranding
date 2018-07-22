import React, { PureComponent } from 'react';
import PropTypes from "prop-types";
import Graph from "./Graph";
import { createOptions, events } from './config';

class NetworkContainer extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      graph: {
        nodes: [],
        edges: []
      }
    }
  }

  updateNetwork = (network) => {
    console.log(network);
    network.once("stabilized", function () {
      network.fit({
        animation: true
      });
      console.log(arguments);
      console.log("stabilized")
    });
  }

  componentDidMount() {
    fetch('/data')
      .then(value => {
        return value.json();
      })
      .then(items => {
        let nodes = [];
        let edges = [];
        items.forEach((item, index) => {
          nodes.push({
            color: {
              highlight: "#55befc"
            },
            size: 25,
            id: item.command[0],
            label: item.command[0],
            shape: "circularImage",
            image: item.static
          });
          item.leadsto.forEach(lead => {
            edges.push({ from: item.command[0], to: lead });
          });
        });
        const graph = {
          nodes,
          edges
        };
        this.setState({ graph });
      })
      .catch(err => {
        // eslint-disable-next-line
        console.log(err);
      })
  }

  render() {
    const { width, height } = this.props;
    return (
      <Graph
        getNetwork={(network) => this.updateNetwork(network)}
        graph={this.state.graph}
        options={createOptions(width, height)}
        events={events}
      />
    );
  }
}

NetworkContainer.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
};

export default NetworkContainer;
