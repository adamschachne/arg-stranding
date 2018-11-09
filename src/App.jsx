import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { Route, Switch, Redirect } from "react-router-dom";
import Network from "./Network/Network";
import Search from "./Menu/Search/Search";
import Landing from "./Landing/Landing";
import Dashboard from "./Dashboard/Dashboard";
import Loader from "./Loader/Loader";

const RESIZE_DELAY = 100; // 100ms

class App extends Component {
  constructor(props) {
    super(props);
    this.resizeEnd = null;
    this.state = {
      dimensions: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      loading: true,
      identity: null
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize);
    fetch("profile", {
      credentials: "same-origin"
    }).then((response) => {
      if (response.status === 401) {
        throw new Error("unauthorized");
      }
      return response.json();
    }).then((identity) => {
      console.log(identity);
      this.setState({ identity, loading: false });
    }).catch((err) => {
      this.setState({ loading: false });
      console.log(err);
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
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
      const guestResponse = await fetch("guest", {
        credentials: "same-origin"
      });
      const identity = await guestResponse.json();
      console.log(identity);
      this.setState({ identity: identity.guest });
    } catch (err) {
      console.error(err);
    }
  }

  renderMenu = ({
    commandToID, loading, searchRef, focusNode
  }) => (
    <Search
      loading={loading}
      searchRef={searchRef}
      commandToID={commandToID}
      focusNode={focusNode}
    />
  )

  render() {
    const { identity, loading, dimensions: { width, height } } = this.state;

    if (loading) {
      return <Loader />;
    }

    if (!identity) {
      return <Landing clickGuest={this.clickGuest} />;
    }

    return (
      <Switch>
        <Route
          path="/graph"
          render={() => (
            <Network
              style={{
                backgroundColor: "#36393f",
                width,
                height
              }}
              renderMenu={this.renderMenu}
            />
          )}
        />
        <Route
          path="/dashboard"
          render={() => <Dashboard identity={identity} />}
        />
        <Route
          render={() => <Redirect to="/dashboard" />}
        />
      </Switch>
    );
  }
}

export default hot(module)(App);
