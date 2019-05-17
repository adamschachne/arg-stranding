import React, { Component } from "react";
import isEqual from "lodash/isEqual";
import differenceWith from "lodash/differenceWith";
import vis from "vis";
import uuidv4 from "uuid/v4";
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
    const { graph, options, events, getNetwork } = this.props;

    this.edges = new vis.DataSet();
    this.nodes = new vis.DataSet();
    this.edges.add(graph.edges);
    this.nodes.add(graph.nodes);

    const container = document.getElementById(identifier);

    this.Network = new vis.Network(
      container,
      Object.assign({}, graph, {
        edges: this.edges,
        nodes: this.nodes
      }),
      options
    );

    /* eslint-disable */
    for (let eventName of Object.keys(events)) {
      this.Network.on(eventName, events[eventName]);
    }
    /* eslint-enable */

    // Object.keys(events).forEach((eventName) => {
    //   this.Network.on(eventName, events[eventName]);
    // });

    if (getNetwork) {
      getNetwork(this.Network);
    }
  }

  // eslint-disable-next-line complexity
  shouldComponentUpdate(nextProps) {
    const {
      options,
      events,
      graph: { nodes, edges }
    } = this.props;
    const {
      options: nextOptions,
      events: nextEvents,
      graph: { nodes: nextNodes, edges: nextEdges }
    } = nextProps;
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
      this.Network.setOptions(nextProps.options);
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

    return false;
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
  graph: {
    nodes: [],
    edges: []
  },
  events: {},
  style: { width: "100%", height: "100%" },
  getNetwork: null
};

Graph.propTypes = {
  options: PropTypes.shape({
    width: PropTypes.string,
    height: PropTypes.string
  }).isRequired,
  events: PropTypes.objectOf(PropTypes.func),
  graph: PropTypes.shape({
    nodes: PropTypes.array,
    edges: PropTypes.array
  }),
  style: PropTypes.shape({
    width: PropTypes.string,
    height: PropTypes.string
  }),
  getNetwork: PropTypes.func
};

export default Graph;
