import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import localForage from "localforage";
import copy from "copy-to-clipboard";
import Graph from "./Graph";
import { options as initialOptions } from "./utils/config";
import buildGraph from "./utils/buildGraph";
import Loader from "../Loader/Loader";
import Search from "../Menu/Search/Search";
import SearchAppBar from "../SearchAppBar/SearchAppBar";
import GraphSettings from "./GraphSettings";
// import InfoBox from "../Info/InfoBox";

class NetworkContainer extends PureComponent {
  constructor(props) {
    super(props);
    const { style: { width, height } } = this.props;
    this.state = {
      graph: {
        nodes: [],
        edges: []
      },
      options: initialOptions,
      commandToID: {},
      loading: true,
      focusNode: null,
      bruteForcedMap: {},
      showBruteForce: true
    };
    this.numItems = 0;
    this.searchRef = React.createRef();
    this.dragging = false;
    /** @type {vis.Network} */
    this.network = null;
    this.events = {
      dragStart: (evt) => {
        // console.log("dragging");
        this.dragging = true;
        // this.props.unfocus();
        if (evt.nodes.length === 0) {
          this.network.unselectAll();
        }
        this.interactNetwork();
      },
      dragEnd: () => {
        // console.log("done dragging");
        this.dragging = false;
      },
      stabilized: () => {
        this.savePositions();
      },
      click: (evt) => {
        this.interactNetwork(evt);
      },
      doubleClick: (doubleClick) => {
        if (doubleClick && doubleClick.nodes.length > 0) {
          const { nodes: [firstNode] } = doubleClick;
          const { graph: { nodes: { [firstNode]: { label } } } } = this.state;
          const command = label.split("\n")[0];
          console.log("copied: ", command);
          copy(command);
        }
      }
    };
  }

  componentDidMount() {
    fetch("/data", {
      credentials: "same-origin",
      redirect: "follow"
    }).then((value) => {
      return value.json();
    }).then(({ items, updated }) => {
      console.log({ items, updated }, new Date(updated).getTime());
      this.numItems = items.length;
      const hideBeforeStabilize = Boolean(this.network);

      const buildNewData = () => {
        this.setState({
          ...buildGraph(items, hideBeforeStabilize),
          loading: hideBeforeStabilize
        });
        localForage.setItem("updated", updated);
      };

      localForage.getItem("updated").then((lastUpdated) => {
        // console.log("last update: ", new Date(lastUpdated).getTime())
        if (lastUpdated === null || lastUpdated !== updated) {
          // data has changed, build graph with new data
          buildNewData();
        } else {
          // get data from localforage and use those positions
          localForage.getItem("positions").then((positions) => {
            if (positions === null) {
              buildNewData();
            } else {
              console.log("USING EXISTING POSITIONS: ", positions);
              this.setState({
                ...buildGraph(
                  items.map((item, ID) => Object.assign({}, item, positions[ID])),
                  hideBeforeStabilize
                ),
                loading: hideBeforeStabilize
              });
            }
          });
        }
      });
    }).catch((err) => {
      console.error(err);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("NETWORK UPDATE");
    const { focusNode } = this.state;
    if (focusNode && prevState.focusNode !== focusNode && this.network) {
      this.network.selectNodes([focusNode]);
      this.network.once("animationFinished", () => {
        //
        console.log("animation finished");
      });
      this.network.focus(focusNode, {
        scale: this.network.getScale(),
        locked: false,
        animation: true
      });
    }
  }

  savePositions = () => {
    if (this.dragging === true) {
      return;
    }
    const request = Array.from(Array(this.numItems).keys());
    localForage.setItem("positions", this.network.getPositions(request));
    // save positions
    console.log("setting positions");
  }

  createNetwork = (network) => {
    this.network = network;
    console.log(network);
    this.network.once("stabilizationIterationsDone", () => {
      this.network.moveTo({
        animation: false,
        position: { x: 0, y: 0 },
        scale: 0.30, // about the right scale to begin to see labels
        offset: { x: 0, y: 0 }
      });
      console.log("iterations done; total time:", performance.now());
      this.savePositions();
      this.unhideNodes();
    });
  }

  interactNetwork = (event) => {
    const nodes = event ? event.nodes : null;
    const { focus } = this.state;
    console.log("NETWORK CLICKED");
    if (nodes && nodes.length === 1) {
      if (focus !== nodes[0]) {
        this.setState({ focusNode: nodes[0] });
      }
    } else {
      this.setState({ focusNode: null });
    }
    // this.searchRef.current.blur();
  }

  unhideNodes = () => {
    const { graph, options } = this.state;
    this.setState({
      graph: {
        nodes: graph.nodes.map(node => ({ ...node, hidden: false })),
        edges: graph.edges
      },
      options: {
        ...options,
        physics: {
          ...options.physics,
          enabled: true
        }
      },
      loading: false
    });
  }

  toggleBruteForce = () => {
    const { graph, showBruteForce, bruteForcedMap } = this.state;
    this.setState({
      showBruteForce: !showBruteForce,
      graph: {
        nodes: graph.nodes.map(({
          x, // take out x
          y, // take out y
          hidden, // take out hidden
          ...node // spread remaining properties
        }) => ({
          ...node,
          hidden: bruteForcedMap[node.id] && showBruteForce
        })),
        edges: graph.edges
      }
    });
  }

  render() {
    const { style } = this.props;
    const {
      loading,
      commandToID,
      graph,
      options,
      showBruteForce,
      bruteForcedMap
    } = this.state;
    const { width, height } = style;
    return (
      <div
        style={{
          ...style,
          width: "100vw",
          height: "100vh"
        }}
      >
        {loading && <Loader loading={loading} />}
        <SearchAppBar />
        {/* MENU */}
        {/* <Search
          loading={loading}
          searchRef={this.searchRef}
          commandToID={commandToID}
          showBruteForce={showBruteForce}
          bruteForcedMap={bruteForcedMap}
          focusNode={cmd => this.setState({ focusNode: commandToID[cmd] })}
        /> */}
        {/* <InfoBox /> */}
        <Graph
          getNetwork={this.createNetwork}
          graph={graph}
          options={{
            ...options,
            // width: `${width}px`,
            // height: `${height}px`,
          }}
          events={this.events}
        />
      </div>
    );
  }
}

NetworkContainer.propTypes = {
  style: PropTypes.shape({
    backgroundColor: PropTypes.string.isRequired
  }).isRequired
};

export default NetworkContainer;
