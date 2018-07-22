import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import Network from './Network/Network';

const RESIZE_DELAY = 100; // 100ms

class App extends Component {

  constructor(props) {
    super(props);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.resizeEnd = null;
    this.state = {
      dimensions: {
        width,
        height
      }
    };    
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
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  render() {
    const { width, height } = this.state.dimensions;
    return (
      <div style={{ width, height }}>
        <Network width={width} height={height} />
      </div>
    );
  }
}

export default hot(module)(App);
