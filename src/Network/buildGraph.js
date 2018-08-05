import localForage from "localforage";

export default ({ items, updated }) => {
  console.log("building graph");
  let commandToID = {};
  let nodes = [];
  let edges = [];

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
    const UNKNOWN_COMMAND = item.command[0].charAt(0) !== "?";
    // nodes            
    nodes.push({
      id: ID,
      label: item.command.length === 1 ? item.command[0] : item.command.join("\n"),
      shape: UNKNOWN_COMMAND ? "image" : "circularImage",
      image: item.static,
      borderWidth: 3,
      size: UNKNOWN_COMMAND ? 20 : 25,
      hidden: true,
      x: item.x,
      y: item.y,
      shapeProperties: {
        useBorderWithImage: true,
        interpolation: false
      }
    });
    // outgoing edges for this node
    item.leadsto.forEach(toNode => {
      const connectedID = commandToID[toNode];
      if (connectedID) {
        edges.push({ from: ID, to: connectedID });
      }
    });
  })

  const graph = {
    nodes,
    edges
  };

  return { graph, commandToID };
}