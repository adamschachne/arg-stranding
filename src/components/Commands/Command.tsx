import React from "react";
import { Item } from "../State";

interface CommandProps {
  item: Item;
}

const Command: React.SFC<CommandProps> = ({ item: { url } }) => {
  return <div>{url}</div>;
};

export default Command;
