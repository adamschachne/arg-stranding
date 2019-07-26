import { hot } from "react-hot-loader/root";
import React, { Component } from "react";
import Landing from "./Landing/Landing";
import Dashboard from "./Dashboard/Dashboard";
import Loader from "./Loader/Loader";
import SettingsPage from "./Settings/SettingsPage";
import { StateProvider } from "./State";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      identity: null,
      updated: ""
    };
  }

  async componentDidMount() {
    try {
      const profileResponse = await fetch("profile", {
        credentials: "same-origin",
        redirect: "follow"
      });
      const identity = await profileResponse.json();
      this.setState({ identity, loading: false });
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
    }
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
        this.setState({ identity, loading: false });
      } catch (err) {
        console.error(err);
        this.setState({ loading: false });
      }
    });
  };

  render() {
    const { identity, loading, updated } = this.state;

    if (loading) {
      return <Loader />;
    }

    if (!identity) {
      return <Landing clickGuest={this.clickGuest} />;
    }

    return (
      <StateProvider>
        <Dashboard identity={identity} updated={updated} />
        <SettingsPage />
      </StateProvider>
    );
  }
}

export default hot(App);
