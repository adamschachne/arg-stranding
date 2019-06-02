import React from "react";
import { Typography } from "@material-ui/core";
import Network from "../Network/Network";
import NumberToWord from "../NumberToWord/NumberToWord";

interface Route {
  text: string;
  page: string;
  Component: any;
  usesScrollbar?: boolean;
}

const routes: Array<Route> = [
  {
    page: "",
    text: "HOME",
    Component: () => <Typography>Home</Typography>
  },
  { page: "numbers", text: "NUMBER TO WORDS", Component: NumberToWord },
  {
    page: "graph",
    text: "GRAPH",
    Component: Network,
    usesScrollbar: false
  },
  ...Array(10)
    .fill(1)
    .map((e, i) => ({
      page: i.toString(),
      text: i.toString(),
      Component: () => <Typography>{i}</Typography>
    }))
];

export default routes;
