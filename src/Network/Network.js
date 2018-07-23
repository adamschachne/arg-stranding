import React, { PureComponent } from 'react';
import PropTypes from "prop-types";
import Graph from "./Graph";
import { createOptions, createEvents } from './config';

class NetworkContainer extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      graph: {
        nodes: [],
        edges: []
      }
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
        let nodes = [];
        let edges = [];
        items.forEach((item, index) => {
          nodes.push({
            id: item.command[0],
            label: item.command.length === 1 ? item.command[0] : item.command.join("\n"),
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
