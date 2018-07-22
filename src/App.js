import React, { Component } from 'react';
import Graph from "./Graph";
// import './App.css';

const createOptions = (width, height) => ({
  width: width + "px",
  height: height + "px",
  groups: {
    useDefaultGroups: true
  },
  // autoResize: true,
  // configure: {
  //   enabled: true,
  //   filter: 'physics, layout',
  //   showButton: true
  // },
  physics: {
    enabled: true,
    solver: 'forceAtlas2Based',
    forceAtlas2Based: {
      gravitationalConstant: -120,
      centralGravity: 0.01,
      springConstant: 0.08,
      springLength: 100,
      damping: 0.4,
      avoidOverlap: 0
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
    borderWidth: 5,
    size: 1000,
    color: {
      border: '#222222',
      background: '#666666'
    },
    shapeProperties: {
      interpolation: false    // 'true' for intensive zooming
    },
    font: { color: '#eeeeee' }
  },
  layout: {
    randomSeed: 1, // constant seed
    improvedLayout: true
  },
  edges: {
    arrowStrikethrough: true,
    chosen: {
      edge: function (values, id, selected, hovering) {
        console.log(arguments);
        // values.property = chosenValue;
      }
    },
    physics: true,
    smooth: false,
    color: {
      color: "white",
      highlight: "#55befc",
    },
    length: 100,
    width: 2,
    selectionWidth: function (width) {
      return width + 1;
    },
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.4
      }
    }
  }
});

var events = {
  selectNode: function (event) {
    console.log(event);
  },
  select: function (event) {
    // console.log(this);
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

  updateNetwork = (network) => {
    // network.once("afterDrawing", function () {
    //   console.log("done drawing");
    //   network.moveTo({
    //     position: { x: 0, y: 0 },
    //     scale: 0.18,
    //     offset: { x: 0, y: 0 },
    //     animation: true
    //   });
    // });
    // this.Network = network;
    console.log(network);
    network.once("stabilized", function () {
      network.fit({
        animation: true
      });
      console.log(arguments);
      console.log("stabilized")
    });
  }
  
  resize = () => {
    console.log("resize");
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

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  render() {
    const { width, height } = this.state.dimensions;
    return (
      <div style={{ width, height }}>
        <Graph
          // eslint-disable-next-line
          getNetwork={(network) => this.updateNetwork(network)}
          graph={this.state.graph}
          options={createOptions(width, height)}
          events={events}
        />
      </div>
    );
  }
}

export default App;
