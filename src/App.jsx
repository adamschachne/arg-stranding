import React, { Component } from "react";
import { hot } from "react-hot-loader/root";
import { withStyles, createStyles } from "@material-ui/core";
import { SettingsProvider } from "./Settings/SettingsContext";
import Landing from "./Landing/Landing";
import Dashboard from "./Dashboard/Dashboard";
import Loader from "./Loader/Loader";

const styles = createStyles({
  "@global": {
    body: {
      fontFamily: "'Source Sans Pro', sans-serif;",
      fontWeight: 600
    }
  }
});

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
    })
      .then((response) => {
        return response.json();
      })
      .then((identity) => {
        console.log(identity);
        this.setState({ identity, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log(err);
      });
  }

  clickGuest = () => {
    this.setState({ loading: true }, async () => {
      try {
        const guestResponse = await fetch("guest", {
          method: "POST",
          credentials: "same-origin"
        });
        const identity = await guestResponse.json();
        console.log(identity);
        this.setState({ identity: identity.guest, loading: false });
      } catch (err) {
        console.error(err);
        this.setState({ loading: false });
      }
    });
  };

  render() {
    const { identity, loading } = this.state;

    if (loading) {
      return <Loader />;
    }

    if (!identity) {
      return <Landing clickGuest={this.clickGuest} />;
    }

    return (
      <SettingsProvider>
        <Dashboard identity={identity} />
      </SettingsProvider>
    );
  }
}

export default hot(withStyles(styles)(App));
