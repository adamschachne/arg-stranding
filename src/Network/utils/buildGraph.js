import localForage from "localforage";

const NON_IMAGE_COMMANDS = {
  "UNKNOWN COMMAND": true,
  "?welcomehome": true,
  "?unitedspaceventures": true,
  "?vd4u08lhb": true
};

export default ({ items, updated }) => {
  console.log("building graph");
  let commandToID = {};
  let nodes = [];
  let edges = [];
  const hasIncomingEdge = {};

  localForage.setItem("updated", updated);

  // iterate through each image once to generate mappings
  items.forEach((item, index) => {
    // each command in that image
    item.command.forEach(cmd => {
      // map the command name to the ID (index)
      commandToID[cmd] = index;
    });
  });

  // iterate again to generate nodes and edges
  items.forEach((item, ID) => {
    const nonImageCommand = NON_IMAGE_COMMANDS[item.command[0]];
    // nodes            
    nodes.push({
      id: ID,
      label: item.command.length === 1 ? item.command[0] : item.command.join("\n"),
      shape: nonImageCommand ? "image" : "circularImage",
      image: item.url,
      size: nonImageCommand ? 20 : 25,
      hidden: true,
      x: item.x,
      y: item.y
    });

    // outgoing edges for this node
    item.leadsto.forEach(toNode => {
      const connectedID = commandToID[toNode];
      if (connectedID) {
        hasIncomingEdge[connectedID] = true;
        edges.push({ from: ID, to: connectedID });
      }
    });
  });

  // loop through once more to color nodes without
  // any incoming edges
  Object.keys(hasIncomingEdge).forEach(nodeID => {
    nodes[nodeID].color = {
      border: "black",
      highlight: "#55befc"
    }
  });

  const graph = {
    nodes,
    edges
  };

  return { graph, commandToID };
}