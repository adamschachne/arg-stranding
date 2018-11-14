import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { Route, Switch, Redirect } from "react-router-dom";
import Network from "./Network/Network";
import Landing from "./Landing/Landing";
import Dashboard from "./Dashboard/Dashboard";
import Loader from "./Loader/Loader";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      identity: null
    };
  }

  componentDidMount() {
    fetch("profile", {
      credentials: "same-origin",
      redirect: "follow"
    }).then((response) => {
      return response.json();
    }).then((identity) => {
      console.log(identity);
      this.setState({ identity, loading: false });
    }).catch((err) => {
      this.setState({ loading: false });
      console.log(err);
    });
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

  render() {
    const { identity, loading } = this.state;

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
                backgroundColor: "#36393f"
              }}
              // renderMenu={this.renderMenu}
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
