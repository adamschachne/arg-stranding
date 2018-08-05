import React, { Component } from "react";
import isEqual from "lodash/isEqual";
import differenceWith from "lodash/differenceWith";
import vis from "vis";
import uuid from "uuid";
import PropTypes from "prop-types";

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: uuid.v4()
    };
  }

  componentDidMount() {
    console.log("mounted", this.props);
    // reference to the network edges and nodes
    this.edges = new vis.DataSet();
    this.nodes = new vis.DataSet();

    let container = document.getElementById(this.state.identifier);

    this.Network = new vis.Network(
      container,
      Object.assign({}, this.props.graph, {
        edges: this.edges,
        nodes: this.nodes
      }),
      this.props.options
    );

    let events = this.props.events || {};
    for (let eventName of Object.keys(events)) {
      this.Network.on(eventName, events[eventName]);
    }

    if (this.props.getNetwork) {
      this.props.getNetwork(this.Network);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate");
    let nodesChange = !isEqual(this.props.graph.nodes, nextProps.graph.nodes);
    let edgesChange = !isEqual(this.props.graph.edges, nextProps.graph.edges);
    let optionsChange = !isEqual(this.props.options, nextProps.options);
    let eventsChange = !isEqual(this.props.events, nextProps.events);

    if (nodesChange || edgesChange || optionsChange || eventsChange) {
      console.log("UPDATING GRAPH", nextProps, this.props);
    }

    if (nodesChange) {
      const idIsEqual = (n1, n2) => n1.id === n2.id;
      const nodesRemoved = differenceWith(this.props.graph.nodes, nextProps.graph.nodes, idIsEqual);
      const nodesAdded = differenceWith(nextProps.graph.nodes, this.props.graph.nodes, idIsEqual);
      const nodesChanged = differenceWith(
        differenceWith(nextProps.graph.nodes, this.props.graph.nodes, isEqual),
        nodesAdded
      );
      this.patchNodes({ nodesRemoved, nodesAdded, nodesChanged });
    }

    if (edgesChange) {
      const edgesRemoved = differenceWith(this.props.graph.edges, nextProps.graph.edges, isEqual);
      const edgesAdded = differenceWith(nextProps.graph.edges, this.props.graph.edges, isEqual);
      const edgesChanged = differenceWith(
        differenceWith(nextProps.graph.edges, this.props.graph.edges, isEqual),
        edgesAdded
      );
      this.patchEdges({ edgesRemoved, edgesAdded, edgesChanged });
    }

    if (optionsChange) {
      this.Network.setOptions(nextProps.options);
      console.log("options changed");
    }

    if (eventsChange) {
      let events = this.props.events || {};
      for (let eventName of Object.keys(events)) this.Network.off(eventName, events[eventName]);

      events = nextProps.events || {};
      for (let eventName of Object.keys(events)) this.Network.on(eventName, events[eventName]);
    }

    this.Network.stabilize();

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
  style: { width: "100%", height: "100%" }
};
Graph.propTypes = {
  options: PropTypes.object,
  events: PropTypes.object,
  graph: PropTypes.shape({
    nodes: PropTypes.array,
    edges: PropTypes.array
  }),
  style: PropTypes.object,
  getNetwork: PropTypes.func,
  getNodes: PropTypes.func,
  getEdges: PropTypes.func,
};

export default Graph;