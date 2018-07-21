import React, { Component } from 'react';
import Graph from "react-graph-vis";
// import './App.css';

var graph = {
  nodes: [
    { id: 1, label: 'Node 1', shape: "circle" },
    { id: 2, label: 'Node 2', shape: "circle" },
    { id: 3, label: 'Node 3', shape: "circle" },
    { id: 4, label: 'Node 4', shape: "circle" },
    { id: 5, label: 'Node 5', shape: "circle" },
    { id: 6, label: 'Node 6', shape: "circle" },
    { id: 7, label: 'Node 7', shape: "circle" }
  ],
  edges: [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 2, to: 5 }
  ]
};

var options = {
  height: '100%',
  width: '100%',
  edges: {
    color: "#000000"
  }
};

var events = {
  select: function (event) {
    var { nodes, edges } = event;
  }
}

class App extends Component {

  // constructor(props) {
  //   super(props);
  //   const width = window.innerWidth;
  //   const height = window.innerHeight;
  //   const larger = width > height ? width : height;
  //   this.state = {
  //     width: larger,
  //     height: larger
  //   };
  // }

  // updateDimensions = () => {
  //   console.log(window.innerWidth, window.innerHeight);
  //   const width = window.innerWidth;
  //   const height = window.innerHeight;
  //   const smaller = width < height ? width : height;
  //   this.setState({
  //     width: smaller,
  //     height: smaller
  //   });
  // }

  componentDidMount() {
    // window.addEventListener("resize", this.updateDimensions);
    fetch('/data')
      .then(value => {
        return value.json();
      })
      .then(json => {
        console.log(json);
      })
      .catch(err => {
      })
  }

  componentWillUnmount() {
    // window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <Graph
          graph={graph}
          options={options}
          events={events}
        />
      </div>
    );
  }
}

export default App;
