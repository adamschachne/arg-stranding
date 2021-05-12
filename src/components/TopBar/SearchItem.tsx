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
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <div {...itemProps}>{result.command}</div>;
};

export default SearchItem;
