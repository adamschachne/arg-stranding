import React, { Component } from 'react';
// import Graph from "react-graph-vis";
import Graph from "./Graph";
// import './App.css';

const createOptions = (width, height) => ({
  width: width + "px",
  height: height + "px",
  groups:{
    useDefaultGroups: true
  },
  // autoResize: true,
  physics: {
    enabled: true,
    solver: 'forceAtlas2Based',
    forceAtlas2Based: {
      gravitationalConstant: -50,
      centralGravity: 0.01,
      springConstant: .08,
      springLength: 100,
      damping: 0.4,
      avoidOverlap: 1
    },
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: false
    },
  },
  nodes: {
    borderWidth: 2,
    size: 1000,
    color: {
      border: '#222222',
      background: '#666666'
    },
    font: { color: '#eeeeee' }
  },  
  layout: {
    randomSeed: 2, // constant seed
    improvedLayout: true
  },
  edges: {
    smooth: false,
    color: {
      color: "white"
    },
    length: 150,
    width: 2,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5
      }
    }
  }
});

var events = {
  select: function (event) {
    console.log(this);
    // var { nodes, edges } = event;
  },
  release: function (event) {
    // console.log(event);
  },
  stabilized: function () {
    
  }
  // afterDrawing: function() {
  //   console.log("done drawing", arguments);
  // }
}

const RESIZE_DELAY = 100; // 100ms

class App extends Component {

  constructor(props) {
    super(props);
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.state = {
      dimensions: {
        width,
        height
      },
      graph: {
        nodes: [],
        edges: []
      }
    }
    this.resizeEnd = null;
  }

  resize = () => {
    // console.log("resize");
    this.setState({
      dimensions: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }

  onResize = () => {
    clearTimeout(this.resizeEnd);
    this.resizeEnd = setTimeout(this.resize, RESIZE_DELAY);
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize);
    fetch('/data')
      .then(value => {
        return value.json();
      })
      .then(items => {
        let nodes = [];
        let edges = [];
        items.forEach((item, index) => {
          nodes.push({ id: item.command[0], label: `Node ${index}`, shape: "circle" });
          item.leadsto.forEach(lead => {
            edges.push({ from: item.command[0], to: lead });
          });
        });
        const graph = {
          nodes,
          edges
        };

        // eslint-disable-next-line
        console.log(graph)
        this.setState({ graph });
      })
      .catch(err => {
        // eslint-disable-next-line
        console.log(err);
      })
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  render() {
    const { width, height } = this.state.dimensions;
    return (
      <div style={{ width, height }}>
        <Graph
          getNetwork={(network) => console.log(network)}
          graph={this.state.graph}
          options={createOptions(width, height)}
          events={events}
        />
      </div>
    );
  }
}

export default App;
