import React from "react";
import Network from "../Network/Network";
import NumberToWord from "../NumberToWord/NumberToWord";
import CommandsContainer from "../Commands/CommandsContainer";
import { StateConsumer } from "../State";

interface Route {
  path: string;
  exact: boolean;
  title: string;
  button: string;
  Component: React.ElementType;
  usesScrollbar: boolean;
  transparentToolbar: boolean;
  typeToSearch: boolean;
}

interface DashboardRouteProps {
  sidebarOpen: boolean;
}

const routes: Array<Route> = [
  // {
  //   path: "",
  //   title: "Home",
  //   button: "Home",
  //   Component: () => <div style={{ padding: 8 }} />
  // },
  {
    path: "/commands",
    exact: false,
    title: "Commands",
    button: "Commands",
    Component: CommandsContainer,
    usesScrollbar: false, // virtual list for this one
    transparentToolbar: false,
    typeToSearch: true
  },
  {
    path: "/graph",
    exact: false,
    title: "Graph",
    button: "Graph",
    Component: ({ sidebarOpen }: DashboardRouteProps) => (
      <StateConsumer>
        {({ items, updated }) => (
          <Network items={items} updated={updated} sidebarOpen={sidebarOpen} />
        )}
      </StateConsumer>
    ),
    usesScrollbar: false,
    transparentToolbar: true,
    typeToSearch: true
  },
  {
    path: "/numbers",
    exact: true,
    title: "Number to Words",
    button: "Numbers",
    Component: NumberToWord,
    transparentToolbar: false,
    typeToSearch: false,
    usesScrollbar: false
  }
  // {
  //   path: "/ngrams",
  //   exact: true,
  //   title: "ngrams",
  //   button: "ngrams",
  //   Component: () => null,
  //   usesScrollbar: false, // virtual list for this one
  //   transparentToolbar: false,
  //   typeToSearch: false
  // }
];

export default routes;
