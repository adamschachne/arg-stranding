/** @type {vis.Options} */
export const options = {
  width: "100%",
  height: "100%",
  autoResize: true,
  groups: {
    useDefaultGroups: true
  },
  // configure: {
  //   enabled: true,
  //   filter: 'physics, layout',
  //   showButton: true
  // },
  physics: {
    enabled: false,
    solver: "forceAtlas2Based",
    forceAtlas2Based: {
      gravitationalConstant: -120,
      centralGravity: 0.01,
      springConstant: 0.08,
      springLength: 100,
      damping: 0.4,
      avoidOverlap: 0
    },
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: false
    }
  },
  nodes: {
    size: 25,
    borderWidth: 3,
    color: {
      border: "#e6cf00",
      highlight: "#55befc"
    },
    shapeProperties: {
      interpolation: false, // 'true' for intensive zooming
      useBorderWithImage: true,
      useImageSize: false
    },
    font: { color: "#eeeeee" }
  },
  layout: {
    randomSeed: 1, // constant seed
    improvedLayout: false
  },
  edges: {
    arrowStrikethrough: true,
    // chosen: {
    //   edge: function (values, id, selected, hovering) {
    //     // console.log(arguments);
    //     // values.property = chosenValue;
    //   }
    // },
    smooth: false,
    color: {
      color: "white",
      highlight: "#55befc"
    },
    length: 100,
    width: 1,
    selectionWidth(width) {
      return width + 1;
    },
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.4
      }
    }
  }
};

export const createEvents = ({ unfocusNode, onDrag, onDragEnd }) => ({
  selectNode(event) {
    // console.log(event);
  },
  select(event) {
    // console.log(this);
    // var { nodes, edges } = event;
  },
  release(event) {
    // console.log(event);
  },
  stabilized() {},
  deselectNode(deselect) {
    unfocusNode();
    // console.log("deselect: ", deselect);
  },
  dragStart(event) {
    console.log("dragstart");
    unfocusNode();
  },
  dragEnd(event) {}
  // afterDrawing: function() {
  //   console.log("done drawing", arguments);
  // }
});
