import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Graph from "./Graph";
import { initOptions } from "./utils/config";
import buildGraph from './utils/buildGraph';
import localForage from "localforage";
import copy from 'copy-to-clipboard';
import Loader from './Loader/Loader';
import InfoBox from '../Info/InfoBox';

class NetworkContainer extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      graph: {
        nodes: [],
        edges: []
      },
      options: initOptions(this.props.width, this.props.height),
      commandToID: {},
      loading: true,
      focusNode: null
    }
    this.searchRef = React.createRef();
    this.dragging = false;
    /** @type {vis.Network} */
    this.network = null;
    this.events = {
      dragStart: (evt) => {
        console.log("dragging");
        this.dragging = true;
        // this.props.unfocus();
        if (evt.nodes.length === 0) {
          this.network.unselectAll();
        }
        this.interactNetwork();
      },
      selectNode: (node) => {
        console.log(node);
      },
      // deselectNode: () => {
      //   // this.props.unfocus();
      //   this.interactNetwork();
      // },
      dragEnd: () => {
        console.log("done dragging");
        this.dragging = false;
      },
      stabilized: () => {
        if (this.dragging === true) {
          return;
        }
        localForage.setItem("positions", this.network.getPositions());
        // save positions
        console.log("setting positions")
      },
      click: evt => {
        this.interactNetwork(evt);
      },
      doubleClick: doubleClick => {
        console.log(doubleClick);
        if (doubleClick.nodes.length > 0) {
          const label = this.state.graph.nodes[doubleClick.nodes[0]].label;
          const command = label.split("\n")[0];
          console.log("copied: ", command);
          copy(command);
        }
      },
      animationFinished: () => {
        console.log("animation finished");
        this.animationFinished();
      }
    }
  }

  animationFinished = () => {

  }

  interactNetwork = (event) => {
    const nodes = event ? event.nodes : null;
    console.log("NETWORK CLICKED", event);
    if (nodes && nodes.length === 1) {
      if (this.state.focus !== nodes[0]) {
        this.setState({ focusNode: nodes[0] });
      }
    } else { 
      // !nodes or nodes length != 1      
      this.setState({ focusNode: null });
    }

    this.searchRef.current.blur();
  }

  updateNetwork = (network) => {
    console.log(network);
    this.network = network;
    network.once("stabilized", () => {

      console.log("stabilized");
      console.log(performance.now());

      this.network.moveTo({
        animation: false,
        position: { x: 0, y: 0 },
        scale: 0.30,
        offset: { x: 0, y: 0 }
      });

      const nodes = this.state.graph.nodes.map(node => {
        const newNode = {
          ...node
        };
        newNode.hidden = false;
        return newNode;
      });

      // replace reference to options instead of mutate it 
      // so that Graph can compare references and update
      this.setState({
        graph: {
          nodes,
          edges: this.state.graph.edges
        },
        options: {
          ...this.state.options,
          physics: {
            ...this.state.options.physics,
            enabled: true
          }
        },
        loading: false
      });
    });
  }

  componentDidMount() {
    fetch('/data').then(value => {
      return value.json();
    }).then(data => {
      // data.graph, data.updated
      console.log(data);
      console.log(new Date(data.updated).getTime());
      localForage.getItem("updated").then(lastUpdated => {
        // console.log("last update: ", new Date(lastUpdated).getTime())
        if (lastUpdated && lastUpdated === data.updated) {
          // get data from localforage and use those positions
          localForage.getItem("positions").then(positions => {
            console.log("USING EXISTING POSITIONS: ");
            data.items.forEach((item, ID) => {
              Object.assign(item, positions[ID]);
            })
            this.setState(buildGraph(data));
          });
        } else {
          console.log("Sheet updated. Building new graph");
          this.setState(buildGraph(data));
        }
      }).catch(err => {
        console.error(err);
        this.setState(buildGraph(data));
      })
    });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("NETWORK UPDATE", this.state);
    const focusNode = this.state.focusNode;
    if (focusNode && prevState.focusNode !== focusNode && this.network) {
      this.network.selectNodes([focusNode]);
      this.network.focus(focusNode, {
        scale: 1,
        locked: false,
        animation: true
      });
    }
  }

  render() {
    // console.log("Network called render", this.state);
    return (
      <div>
        {this.state.loading && <Loader loading={this.state.loading} />}
        {/* MENU */}
        {this.props.renderMenu({
          searchRef: this.searchRef,
          nodes: this.state.graph.nodes,
          loading: this.state.loading,
          focusNode: (cmd) => this.setState({ focusNode: this.state.commandToID[cmd] })
        })}
        {/* <InfoBox /> */}
        <Graph
          getNetwork={this.updateNetwork}
          graph={this.state.graph}
          options={{
            ...this.state.options,
            width: this.props.width + "px",
            height: this.props.height + "px",
          }}
          events={this.events}
        />
      </div>
    );
  }
}

NetworkContainer.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  renderMenu: PropTypes.func.isRequired
};

export default NetworkContainer;
