import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import localForage from "localforage";
import copy from "copy-to-clipboard";
import { withTheme } from "@material-ui/styles";
import Graph from "./Graph";
import { options as initialOptions } from "./utils/config";
import buildGraph from "./utils/buildGraph";
import Loader from "../Loader/Loader";
// import Search from "../Menu/Search/Search";
// import SearchAppBar from "../SearchAppBar/SearchAppBar";
// import GraphSettings from "./GraphSettings";
// import InfoBox from "../Info/InfoBox";

let vis;

function zoomOutMobile() {
  const viewport = document.querySelector(`meta[name="viewport"]`);

  if (viewport) {
    viewport.content = "initial-scale=1";
    viewport.content = "width=device-width";
  }
}

class NetworkContainer extends PureComponent {
  constructor(props) {
    super(props);
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
    // focus/moveTo offset
    this.offset = {
      x: props.sidebarOpen ? props.theme.drawerWidth / 2 : 0,
      y: 0
    };
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
          const {
            nodes: [firstNode]
          } = doubleClick;
          const {
            graph: {
              nodes: {
                [firstNode]: { label }
              }
            }
          } = this.state;
          const command = label.split("\n")[0];
          console.log("copied: ", command);
          copy(command);
        }
      }
    };
    if (vis === undefined) {
      import("vis").then((vismodule) => {
        vis = vismodule;
        this.forceUpdate();
      });
    }
  }

  componentDidMount() {
    const { items, updated } = this.props;
    this.updateGraph(items, updated);
  }

  // eslint-disable-next-line complexity
  componentDidUpdate(prevProps, prevState) {
    console.log("NETWORK UPDATE");

    // check if items changed
    const { items, updated } = this.props;
    const { items: prevItems, updated: prevUpdated } = prevProps;
    if (items !== prevItems || updated !== prevUpdated) {
      this.updateGraph(items, updated);
    }

    if (this.network === null) return;
    const { focusNode } = this.state;
    const {
      sidebarOpen,
      theme: { drawerWidth }
    } = this.props;
    const offsetChanged = sidebarOpen !== prevProps.sidebarOpen;
    const prevOffset = this.offset;
    if (offsetChanged === true) {
      this.offset = {
        x: sidebarOpen ? drawerWidth / 2 : 0,
        y: 0
      };
    }
    const animation = { duration: offsetChanged ? 300 : 1000, easingFunction: "easeOutCubic" };

    if (focusNode !== null && (prevState.focusNode !== focusNode || offsetChanged)) {
      this.network.selectNodes([focusNode]);
      this.network.once("animationFinished", () => {
        console.log("animation finished");
      });
      this.network.focus(focusNode, {
        scale: this.network.getScale(),
        locked: false,
        animation,
        offset: this.offset
      });
    } else if (offsetChanged) {
      this.network.moveTo({
        animation,
        position: this.network.getViewPosition(),
        scale: this.network.getScale(),
        offset: {
          x: this.offset.x - prevOffset.x,
          y: this.offset.y - prevOffset.y
        }
      });
    }
  }

  updateGraph = (items, updated) => {
    console.log(items, updated, new Date(updated).getTime());
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
  };

  savePositions = () => {
    if (this.dragging === true) {
      return;
    }
    const request = Array.from(Array(this.numItems).keys());
    localForage.setItem("positions", this.network.getPositions(request));
    // save positions
    console.log("setting positions");
  };

  createNetwork = (network) => {
    this.network = network;
    console.log(network);
    this.network.once("stabilizationIterationsDone", () => {
      this.network.moveTo({
        animation: false,
        position: { x: 0, y: 0 },
        scale: 0.3, // about the right scale to begin to see labels
        offset: this.offset
      });
      console.log("iterations done; total time:", performance.now());
      this.savePositions();
      this.unhideNodes();
    });
  };

  // eslint-disable-next-line complexity
  interactNetwork = (event) => {
    const nodes = event ? event.nodes : null;
    const { focus } = this.state;
    const { activeElement } = document;
    if (activeElement && activeElement.blur) {
      activeElement.blur();
    }

    zoomOutMobile();

    console.log("NETWORK CLICKED");
    if (nodes && nodes.length === 1) {
      if (focus !== nodes[0]) {
        this.setState({ focusNode: nodes[0] });
      }
    } else {
      this.setState({ focusNode: null });
    }
    // this.searchRef.current.blur();
  };

  unhideNodes = () => {
    const { graph, options } = this.state;
    this.setState({
      graph: {
        nodes: graph.nodes.map((node) => ({ ...node, hidden: false })),
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
  };

  toggleBruteForce = () => {
    const { graph, showBruteForce, bruteForcedMap } = this.state;
    this.setState({
      showBruteForce: !showBruteForce,
      graph: {
        nodes: graph.nodes.map(({ x, y, hidden, ...node }) => ({
          // take out x // take out y // take out hidden // spread remaining properties
          ...node,
          hidden: bruteForcedMap[node.id] && showBruteForce
        })),
        edges: graph.edges
      }
    });
  };

  render() {
    const { loading, commandToID, graph, options, showBruteForce, bruteForcedMap } = this.state;
    return (
      <div
        style={{
          backgroundColor: "#36393f",
          height: "100%",
          width: "100vw",
          position: "absolute",
          top: 0,
          left: 0
        }}
      >
        {loading && (
          <div
            style={{
              top: this.offset.y,
              left: this.offset.x,
              position: "relative",
              height: "100%",
              width: "100%"
            }}
          >
            <Loader />
          </div>
        )}
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
        {vis !== undefined && (
          <Graph
            vis={vis}
            getNetwork={this.createNetwork}
            graph={graph}
            options={{
              ...options
              // width: `${width}px`,
              // height: `${height}px`,
            }}
            events={this.events}
          />
        )}
      </div>
    );
  }
}

NetworkContainer.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      command: PropTypes.arrayOf(PropTypes.string),
      leadsto: PropTypes.arrayOf(PropTypes.string),
      url: PropTypes.string,
      bruteforce: PropTypes.bool
    })
  ).isRequired,
  updated: PropTypes.string.isRequired,
  theme: PropTypes.shape({
    drawerWidth: PropTypes.number
  }).isRequired,
  sidebarOpen: PropTypes.bool.isRequired
};

export default withTheme(NetworkContainer);
