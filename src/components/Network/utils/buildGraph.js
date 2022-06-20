export default function buildGraph(items, hidden = false) {
  console.log("building graph");
  const commandToID = {};
  const nodes = [];
  const edges = [];
  const hasIncomingEdge = {};
  const bruteForcedMap = {};

  // iterate through each image once to generate mappings
  items.forEach((item, index) => {
    // map the command name to the item id
    item.command.forEach((cmd) => {
      commandToID[cmd] = index;
    });

    // populate brute forced nodes map
    bruteForcedMap[item.id] = item.bruteforce;
  });

  // iterate again to generate nodes and edges
  items.forEach((item, index) => {
    const nonImageCommand = !item.lastModified;
    // nodes
    nodes.push({
      id: index,
      searchId: item.id,
      label: item.command.length === 1 ? item.command[0] : item.command.join("\n"),
      shape: nonImageCommand ? "image" : "circularImage",
      image: item.url,
      size: nonImageCommand ? 20 : 25,
      hidden,
      x: item.x,
      y: item.y
    });

    // outgoing edges for this node
    item.leadsto.forEach(({ id: targetId, command }) => {
      const toID = commandToID[command];
      if (toID) {
        hasIncomingEdge[toID] = true;
        edges.push({ from: index, to: toID });
      }
    });
  });

  // loop through once more to color nodes without
  // any incoming edges
  Object.keys(hasIncomingEdge).forEach((nodeID) => {
    nodes[nodeID].color = {
      border: "black",
      highlight: "#55befc"
    };
  });

  return { nodes, edges, commandToID, bruteForcedMap };
}
