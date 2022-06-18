import React, { Component } from "react";
import isEqual from "lodash/isEqual";
import differenceWith from "lodash/differenceWith";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: uuidv4()
    };
  }

  componentDidMount() {
    const { identifier } = this.state;
    const { nodes, edges, options, events, getNetwork, vis } = this.props;

    this.edges = new vis.DataSet();
    this.nodes = new vis.DataSet();
    this.edges.add(edges);
    this.nodes.add(nodes);

    const container = document.getElementById(identifier);

    this.Network = new vis.Network(container, { edges: this.edges, nodes: this.nodes }, options);

    for (const eventName of Object.keys(events)) {
      this.Network.on(eventName, events[eventName]);
    }

    if (getNetwork) {
      getNetwork(this.Network);
    }

    console.log("stabilizing");
    this.Network.stabilize();
  }

  // eslint-disable-next-line complexity
  componentDidUpdate(prevProps, prevState) {
    const { options, events, nodes, edges } = prevProps;
    const {
      options: nextOptions,
      events: nextEvents,
      nodes: nextNodes,
      edges: nextEdges
    } = this.props;

    const nodesChange = !isEqual(nodes, nextNodes);
    let nodesRemoved = [];
    let nodesAdded = [];
    let nodesChanged = [];

    const edgesChange = !isEqual(edges, nextEdges);
    const optionsChange = !isEqual(options, nextOptions);
    const eventsChange = !isEqual(events, nextEvents);

    if (nodesChange) {
      const idIsEqual = (n1, n2) => n1.id === n2.id;
      nodesRemoved = differenceWith(nodes, nextNodes, idIsEqual);
      nodesAdded = differenceWith(nextNodes, nodes, idIsEqual);
      nodesChanged = differenceWith(differenceWith(nextNodes, nodes, isEqual), nodesAdded);
      this.patchNodes({ nodesRemoved, nodesAdded, nodesChanged });
    }

    if (edgesChange) {
      const edgesRemoved = differenceWith(edges, nextEdges, isEqual);
      const edgesAdded = differenceWith(nextEdges, edges, isEqual);
      const edgesChanged = differenceWith(differenceWith(nextEdges, edges, isEqual), edgesAdded);
      this.patchEdges({ edgesRemoved, edgesAdded, edgesChanged });
    }

    if (optionsChange) {
      console.log("options changed");
      this.Network.setOptions(nextOptions);
    }

    if (eventsChange) {
      Object.keys(events).forEach((eventName) => {
        this.Network.off(eventName, events[eventName]);
      });

      Object.keys(nextEvents).forEach((eventName) => {
        this.Network.on(eventName, nextEvents[eventName]);
      });
    }

    // only stabilize if nodes were added or removed
    if (nodesChange && (nodesAdded.length > 0 || nodesRemoved.length > 0)) {
      this.Network.stabilize();
    }
  }

  patchEdges({ edgesRemoved, edgesAdded, edgesChanged }) {
    this.edges.remove(edgesRemoved);
    this.edges.add(edgesAdded);
    this.edges.update(edgesChanged);
  }

  patchNodes({ nodesRemoved, nodesAdded, nodesChanged }) {
    this.nodes.remove(nodesRemoved);
    this.nodes.add(nodesAdded);
    this.nodes.update(nodesChanged);
  }

  render() {
    const { identifier } = this.state;
    const { style } = this.props;
    return (
      <div id={identifier} style={style}>
        {identifier}
      </div>
    );
  }
}

Graph.defaultProps = {
  nodes: [],
  edges: [],
  events: {},
  style: { width: "100%", height: "100%" },
  getNetwork: null
};

/* eslint-disable react/forbid-prop-types */
Graph.propTypes = {
  vis: PropTypes.shape({
    DataSet: PropTypes.any,
    Network: PropTypes.any
  }).isRequired,
  options: PropTypes.shape({
    width: PropTypes.string,
    height: PropTypes.string
  }).isRequired,
  events: PropTypes.objectOf(PropTypes.func),
  nodes: PropTypes.array,
  edges: PropTypes.array,
  style: PropTypes.shape({
    width: PropTypes.string,
    height: PropTypes.string
  }),
  getNetwork: PropTypes.func
};

export default Graph;
