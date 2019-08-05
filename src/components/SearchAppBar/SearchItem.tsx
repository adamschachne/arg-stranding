import React from "react";

interface Props {
  itemProps: any;
  label: string;
}

const SearchItem: React.FC<Props> = ({ itemProps, label }) => {
  // console.log(itemProps);
  return <div {...itemProps}>{label}</div>;
};

export default SearchItem;
