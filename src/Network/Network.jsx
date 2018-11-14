import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import localForage from "localforage";
import copy from "copy-to-clipboard";
import Graph from "./Graph";
import { options as initialOptions } from "./utils/config";
import buildGraph from "./utils/buildGraph";
import Loader from "../Loader/Loader";
import Search from "../Menu/Search/Search";
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
      focusNode: null
    };
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
        console.log("setting positions");
      },
      click: (evt) => {
        this.interactNetwork(evt);
      },
      doubleClick: (doubleClick) => {
        if (doubleClick && doubleClick.nodes.length > 0) {
          const { nodes: { 0: firstNode } } = doubleClick;
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
      const hideBeforeStabilize = Boolean(this.network);

      if (hideBeforeStabilize) {
        this.network.once("stabilized", () => {
          this.network.moveTo({
            animation: false,
            position: { x: 0, y: 0 },
            scale: 0.30, // about the right scale to begin to see labels
            offset: { x: 0, y: 0 }
          });
          console.log("stabilized", performance.now());
          this.unhideNodes();
        });
      }

      localForage.getItem("updated").then((lastUpdated) => {
        // console.log("last update: ", new Date(lastUpdated).getTime())
        if (lastUpdated && lastUpdated !== updated) {
          // data has changed, build graph with new data
          this.setState({
            ...buildGraph(items, updated, hideBeforeStabilize),
            loading: hideBeforeStabilize
          });
        } else {
          // get data from localforage and use those positions
          localForage.getItem("positions").then((positions) => {
            console.log("USING EXISTING POSITIONS: ");
            // items.forEach((item, ID) => {
            //   // set each node's x,y where they were last
            //   Object.assign(item, positions[ID]);
            // });
            this.setState({
              ...buildGraph(
                items.map((item, ID) => Object.assign({}, item, positions[ID])),
                updated,
                hideBeforeStabilize
              ),
              loading: hideBeforeStabilize
            });
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

      });
      this.network.focus(focusNode, {
        scale: this.network.getScale(),
        locked: false,
        animation: true
      });
    }
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
    this.searchRef.current.blur();
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

  render() {
    // console.log("Network called render", this.state);
    const { style } = this.props;
    const {
      loading, commandToID, graph, options
    } = this.state;
    const { width, height } = style;
    console.log(style);
    return (
      <div
        style={{
          ...style,
          width: "100vw",
          height: "100vh"
        }}
      >
        {loading && <Loader loading={loading} />}
        {/* MENU */}
        <Search
          loading={loading}
          searchRef={this.searchRef}
          commandToID={commandToID}
          focusNode={cmd => this.setState({ focusNode: commandToID[cmd] })}
        />
        {/* <InfoBox /> */}
        <Graph
          getNetwork={(network) => { this.network = network; }}
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
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired
};

export default NetworkContainer;
