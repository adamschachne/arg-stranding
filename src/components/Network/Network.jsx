import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import localForage from "localforage";
import copy from "copy-to-clipboard";
import { withTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import Graph from "./Graph";
import { options as initialOptions } from "./utils/config";
import buildGraph from "./utils/buildGraph";
import Loader from "../Loader/Loader";
// import Search from "../Menu/Search/Search";
// import SearchAppBar from "../SearchAppBar/SearchAppBar";
// import GraphSettings from "./GraphSettings";
// import InfoBox from "../Info/InfoBox";

/** @type {import("vis")} */
let vis;

localForage.config({
  name: "death stranding"
});

function zoomOutMobile() {
  const viewport = document.querySelector(`meta[name="viewport"]`);

  if (viewport) {
    viewport.content = "initial-scale=1";
    viewport.content = "width=device-width";
  }
}

function lastPathComponent(pathname) {
  return pathname.substring(pathname.lastIndexOf("/") + 1);
}
class NetworkContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      edges: [],
      options: initialOptions,
      commandToID: {},
      /** @type {boolean} */
      loading: true,
      bruteForcedMap: {},
      showBruteForce: true
    };
    this.isAnimating = false;
    this.mounted = false;
    this.numItems = 0;
    this.searchRef = React.createRef();
    this.dragging = false;
    /** @type {import("vis").Network} network */
    this.network = null;

    // focus/moveTo offset
    this.offset = {
      x: props.sidebarOpen ? props.theme.drawerWidth / 2 : 0,
      y: 0
    };

    this.events = {
      dragStart: (evt) => {
        console.log("dragstart");
        this.dragging = true;
        // this.props.unfocus();
        if (evt.nodes.length === 0) {
          this.network.unselectAll();
        }
        this.interactNetwork();
      },
      dragEnd: () => {
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
            nodes: {
              [firstNode]: { label }
            }
          } = this.state;
          const command = label.split("\n")[0];
          console.log("copied: ", command);
          copy(command);
        }
      },
      animationFinished: () => {
        this.isAnimating = false;
        console.log("animation finished");
      },
      zoom: () => {
        console.log("zoom");
        this.stopAnimations();
      }
    };
    if (vis === undefined) {
      import("vis").then((vismodule) => {
        vis = vismodule;
        if (this.mounted === true) {
          this.forceUpdate();
        }
      });
    }
  }

  componentDidMount() {
    this.mounted = true;
    const { items, updated } = this.props;
    this.updateGraph(items, updated);
  }

  // eslint-disable-next-line complexity
  componentDidUpdate(prevProps, prevState) {
    // check if items changed
    const {
      items,
      updated,
      location: { pathname }
    } = this.props;
    const {
      items: prevItems,
      updated: prevUpdated,
      location: { pathname: prevPathName }
    } = prevProps;
    console.log("NETWORK UPDATE");
    if (items !== prevItems || updated !== prevUpdated) {
      this.updateGraph(items, updated);
    }

    if (this.network === null) return;
    const focusNode = this.getFocusNode(pathname);
    const prevFocusNode = this.getFocusNode(prevPathName);

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

    // user opened the sidebar
    if (offsetChanged) {
      this.isAnimating = true;
      this.network.moveTo({
        position: this.network.getViewPosition(),
        animation,
        offset: {
          x: this.offset.x - prevOffset.x,
          y: this.offset.y - prevOffset.y
        }
      });
    }
    // sidebar didn't change but the focus node did
    else if (focusNode !== null && prevFocusNode !== focusNode) {
      // user selected a new node
      this.selectAndMoveToNode(focusNode, animation);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.network) {
      this.network.destroy();
      this.network = null;
    }
  }

  selectAndMoveToNode = (focusNode, animation) => {
    this.network.selectNodes([focusNode]);
    this.isAnimating = true;
    // moveTo and focus seem to do the same things
    this.network.moveTo({
      position: this.network.getPositions(focusNode)[focusNode],
      animation,
      offset: this.offset
    });
  };

  /** @returns {number | null} the node index or null if none */
  getFocusNode = (pathname) => {
    const { nodes } = this.state;
    const component = lastPathComponent(pathname);
    if (component === "") {
      return null;
    }

    const node = nodes.find((n) => n.searchId === component) ?? null;
    if (node != null) {
      return node.id;
    }

    return null;
  };

  stopAnimations = () => {
    if (!this.network) return;

    this.isAnimating = false;
    this.network.moveTo({
      position: this.network.getViewPosition()
    });
  };

  updateGraph = async (items, updated) => {
    console.log(items, updated, new Date(updated).getTime());
    this.numItems = items.length;
    // const hideBeforeStabilize = Boolean(this.network);

    const buildNewData = () => {
      if (this.mounted === false) return;

      this.setState({
        ...buildGraph(items, true),
        loading: true
      });
      localForage.setItem("updated", updated);
    };

    const lastUpdated = await localForage.getItem("updated");
    // console.log("last update: ", new Date(lastUpdated).getTime())
    if (lastUpdated === null || lastUpdated !== updated) {
      // data has changed, build graph with new data
      console.log("no data. building new data");
      buildNewData();
    } else {
      // get data from localforage and use those positions
      const positions = await localForage.getItem("positions");
      if (positions === null) {
        buildNewData();
      } else {
        if (this.mounted === false) return;

        console.log("USING EXISTING POSITIONS: ", positions);
        this.setState({
          ...buildGraph(
            items.map((item, index) => ({ ...item, ...positions[index] })),
            false
          ),
          loading: true
        });
      }
    }
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

  /** @param {import("vis").Network} network */
  createNetwork = (network) => {
    const {
      location: { pathname }
    } = this.props;
    this.network = network;
    console.log(network);
    this.network.once("stabilizationIterationsDone", () => {
      this.savePositions();
      this.unhideNodes();
      console.log("iterations done; total time:", performance.now());

      const focusNode = this.getFocusNode(pathname);
      if (focusNode) {
        const animation = { duration: 1000, easingFunction: "easeOutCubic" };
        this.selectAndMoveToNode(focusNode, animation);
      } else {
        this.network.moveTo({
          animation: false,
          position: { x: 0, y: 0 },
          scale: 0.3, // about the right scale to begin to see labels
          offset: this.offset
        });
      }
    });
  };

  // eslint-disable-next-line complexity
  interactNetwork = (event) => {
    const clicked = event ? event.nodes : null;
    const { nodes } = this.state;
    const { activeElement } = document;
    const {
      history,
      location: { pathname }
    } = this.props;
    if (activeElement && activeElement.blur) {
      activeElement.blur();
    }

    this.stopAnimations();

    zoomOutMobile();

    console.log("NETWORK CLICKED");

    /** @type string */
    const clickedNode = clicked && clicked.length === 1 ? nodes[clicked[0]].searchId : "";

    if (lastPathComponent(pathname) !== clickedNode) {
      history.push(`/graph/${clickedNode}`);
    }
  };

  unhideNodes = () => {
    const { nodes, edges, options } = this.state;
    this.setState({
      nodes: nodes.map((node) => ({ ...node, hidden: false })),
      edges,
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
    const { nodes, edges, showBruteForce, bruteForcedMap } = this.state;
    this.setState({
      showBruteForce: !showBruteForce,
      nodes: nodes.map(({ x, y, hidden, ...node }) => ({
        ...node,
        hidden: bruteForcedMap[node.id] && showBruteForce
      })),
      edges
    });
  };

  render() {
    const { loading, commandToID, nodes, edges, options, showBruteForce, bruteForcedMap } =
      this.state;
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
            nodes={nodes}
            edges={edges}
            options={options}
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
  sidebarOpen: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

export default withTheme(withRouter(NetworkContainer));
