import React from "react";

interface Props {
  itemProps: any;
}

const SearchItem: React.FC<Props> = ({ itemProps }) => {
  return <div {...itemProps}>hello</div>;
};

export default SearchItem;
