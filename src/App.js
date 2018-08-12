import React, { Component } from 'react';
import Network from './Network/Network';
import Menu from './Menu/Menu'
import Search from './Search/Search';

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
      },
      focus: null,
      loading: true
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

  renderMenu = ({ nodes, loading, searchRef, focusNode }) => {
    return (
      <Menu loading={loading}>
        <Search
          loading={loading}
          searchRef={searchRef}
          nodes={nodes}
          focusNode={focusNode}
        />
      </Menu>
    );
  }

  render() {
    const { width, height } = this.state.dimensions;
    return (
      <div style={{ width, height }}>
        <Network
          width={width}
          height={height}
          renderMenu={this.renderMenu}
        />
      </div>
    );
  }
}

export default App;
