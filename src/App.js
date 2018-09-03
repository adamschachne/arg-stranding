import React, { Component } from 'react';
import Network from './Network/Network';
import Search from './Menu/Search/Search';
import { hot } from 'react-hot-loader';
import { Route, Switch, Redirect } from 'react-router-dom';
import Landing from './Landing/Landing';

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
      loading: true,
      session: false
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
    fetch("profile") 
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  renderMenu = ({ nodes, loading, searchRef, focusNode }) => {
    return (
      <Search
        loading={loading}
        searchRef={searchRef}
        nodes={nodes}
        focusNode={focusNode}
      />
    );
  }

  render() {
    console.log("rendering app");
    const { width, height } = this.state.dimensions;
    return (
      <Switch>
        <Route
          path='/graph'
          render={() => {
            return (
              <div style={{ width, height }}>
                <Network
                  width={width}
                  height={height}
                  renderMenu={this.renderMenu}
                />
              </div>
            );
          }}
        />
        <Route
          render={() => {
            if (this.state.session) {
              return <Redirect to="/graph" />;
            }
            return <Landing />;
          }}
        />
      </Switch>
    );
  }
}

export default hot(module)(App);
