import React from "react";
import { FlexItem } from "../State";

interface Props {
  itemProps: any;
  selected: boolean;
  highlighted: boolean;
  result: FlexItem;
}

const SearchItem: React.FC<Props> = ({ itemProps, result }) => {
  // console.log(itemProps);
  return <div {...itemProps}>{result.filename}</div>;
};

export default SearchItem;
