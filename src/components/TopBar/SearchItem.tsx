import React from "react";
import { FlexItem } from "../State";

interface Props {
  itemProps: any;
  selected: boolean;
  highlighted: boolean;
  result: FlexItem;
}

// not using this yet

const SearchItem: React.FC<Props> = ({ itemProps, result }) => {
  // console.log(itemProps);
  return <div {...itemProps}>{result.filename}</div>;
};

export default SearchItem;
