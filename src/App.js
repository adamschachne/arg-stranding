import React, { Component } from 'react';
import Network from './Network/Network';
import Search from './Menu/Search/Search';
import { hot } from 'react-hot-loader';
import { Route, Switch, Redirect } from 'react-router-dom';
import Landing from './Landing/Landing';
import { HashLoader } from 'react-spinners';
import Dashboard from './Dashboard/Dashboard';
import Loader from './Loader/Loader';

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
      identity: null
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

  clickGuest = async () => {
    try {
      const guestResponse = await fetch("guest");
      const identity = await guestResponse.json();
      console.log(identity);
      this.setState({ identity: identity.guest });
    } catch (err) {
      console.error(err);
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize);
    fetch("profile").then(response => {
      if (response.status === 401) {
        throw new Error("unauthorized");
      }
      return response.json();
    }).then(identity => {
      console.log(identity);
      this.setState({ identity, loading: false });
    }).catch(err => {
      this.setState({ loading: false });
      console.log(err);
    })
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

    if (this.state.loading) {
      return <Loader />;
    }

    if (!this.state.identity) {
      return <Landing clickGuest={this.clickGuest} />;
    }

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
          path="/dashboard"
          render={() => {
            return <Dashboard identity={this.state.identity}/>
          }}
        />
        <Route
          render={() => {
            return <Redirect to="/dashboard" />;
          }}
        />
      </Switch>
    );
  }
}

export default hot(module)(App);
