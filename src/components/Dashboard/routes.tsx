import React from "react";
import Network from "../Network/Network";
import NumberToWord from "../NumberToWord/NumberToWord";
import CommandsContainer from "../Commands/CommandsContainer";
import { StateConsumer } from "../State";

interface Route {
  path: string;
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
    path: "",
    title: "Number to Words",
    button: "Numbers",
    Component: NumberToWord,
    transparentToolbar: false,
    typeToSearch: false,
    usesScrollbar: false
  },
  {
    path: "graph",
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
    path: "commands",
    title: "Commands",
    button: "Commands",
    Component: CommandsContainer,
    usesScrollbar: false, // virtual list for this one
    transparentToolbar: false,
    typeToSearch: true
  }
];

export default routes;
