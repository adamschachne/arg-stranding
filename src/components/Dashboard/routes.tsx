import React from "react";
import { Typography } from "@material-ui/core";
import Network from "../Network/Network";
import NumberToWord from "../NumberToWord/NumberToWord";
import CommandsContainer from "../Commands/CommandsContainer";
import { StateConsumer } from "../State";

interface Route {
  path: string;
  title: string;
  button: string;
  Component: React.ElementType;
  usesScrollbar?: boolean;
  transparentToolbar?: boolean;
}

interface DashboardRouteProps {
  sidebarOpen: boolean;
}

const routes: Array<Route> = [
  // {
  //   path: "",
  //   title: "Home",
  //   button: "Home",
  //   Component: () => (
  //     <div style={{ padding: 8 }}>
  //       <Typography>
  //         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
  //         ut labore et dolore magna aliqua. Fermentum et sollicitudin ac orci phasellus. A diam
  //         sollicitudin tempor id eu nisl. Volutpat consequat mauris nunc congue nisi vitae suscipit
  //         tellus. Sit amet luctus venenatis lectus magna fringilla urna porttitor rhoncus. Pretium
  //         lectus quam id leo in. Vel fringilla est ullamcorper eget. Risus sed vulputate odio ut
  //         enim blandit. Consequat interdum varius sit amet. Ut porttitor leo a diam sollicitudin.
  //         Amet cursus sit amet dictum. Eget aliquet nibh praesent tristique magna. At elementum eu
  //         facilisis sed odio. Est placerat in egestas erat imperdiet sed euismod. Vel facilisis
  //         volutpat est velit egestas.
  //       </Typography>
  //       <br />
  //       <Typography>
  //         Viverra nam libero justo laoreet sit amet cursus sit amet. Nascetur ridiculus mus mauris
  //         vitae ultricies leo integer malesuada. At auctor urna nunc id cursus. Nunc scelerisque
  //         viverra mauris in aliquam sem fringilla ut morbi. Blandit aliquam etiam erat velit
  //         scelerisque in. Elementum nibh tellus molestie nunc non blandit massa enim nec. Duis at
  //         tellus at urna. Tempor orci eu lobortis elementum nibh tellus molestie nunc. Ipsum nunc
  //         aliquet bibendum enim. Erat velit scelerisque in dictum non consectetur a erat nam. Ac
  //         tincidunt vitae semper quis lectus nulla at volutpat diam. Purus viverra accumsan in nisl
  //         nisi. Aliquet eget sit amet tellus cras adipiscing enim eu turpis. Mattis ullamcorper
  //         velit sed ullamcorper morbi. Tincidunt praesent semper feugiat nibh sed. Aliquam purus sit
  //         amet luctus venenatis lectus magna. Commodo quis imperdiet massa tincidunt nunc pulvinar
  //         sapien et. Ut tristique et egestas quis. Nisi quis eleifend quam adipiscing.
  //       </Typography>
  //       <br />
  //       <Typography>
  //         In tellus integer feugiat scelerisque varius. Eget egestas purus viverra accumsan in nisl
  //         nisi scelerisque eu. Sed ullamcorper morbi tincidunt ornare massa. Ipsum suspendisse
  //         ultrices gravida dictum fusce ut. Et netus et malesuada fames ac turpis. Bibendum neque
  //         egestas congue quisque. At tempor commodo ullamcorper a. Nibh cras pulvinar mattis nunc
  //         sed. Aenean sed adipiscing diam donec adipiscing tristique risus nec feugiat. Ipsum dolor
  //         sit amet consectetur adipiscing elit.
  //       </Typography>
  //     </div>
  //   )
  // },
  { path: "", title: "Number to Words", button: "Numbers", Component: NumberToWord },
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
    transparentToolbar: true
  },
  {
    path: "commands",
    title: "Commands",
    button: "Commands",
    usesScrollbar: false, // virtual list for this one
    Component: CommandsContainer
  }
];

export default routes;
