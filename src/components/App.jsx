import React, { Component } from "react";
import { hot } from "react-hot-loader/root";
import Landing from "./Landing/Landing";
import Dashboard from "./Dashboard/Dashboard";
import Loader from "./Loader/Loader";
import SettingsPage from "./Settings/SettingsPage";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      identity: null,
      items: []
    };
  }

  async componentDidMount() {
    try {
      const profileResponse = await fetch("profile", {
        credentials: "same-origin",
        redirect: "follow"
      });
      const profile = await profileResponse.json();
      this.loadData(profile);
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
    }
  }

  loadData = async (identity) => {
    try {
      const dataResponse = await fetch("data");
      const data = await dataResponse.json();
      this.setState({ identity, items: data.items, loading: false });
    } catch (err) {
      console.error(err);
      this.setState({ identity, loading: false });
    }
  };

  clickGuest = () => {
    this.setState({ loading: true }, async () => {
      try {
        const guestResponse = await fetch("guest", {
          method: "POST",
          credentials: "same-origin"
        });
        const identity = await guestResponse.json();
        console.log(identity);
        this.loadData(identity);
      } catch (err) {
        console.error(err);
        this.setState({ loading: false });
      }
    });
  };

  render() {
    const { identity, loading, items } = this.state;

    if (loading) {
      return <Loader />;
    }

    if (!identity) {
      return <Landing clickGuest={this.clickGuest} />;
    }

    return (
      <>
        <Dashboard identity={identity} items={items} />
        <SettingsPage />
      </>
    );
  }
}

export default hot(App);
