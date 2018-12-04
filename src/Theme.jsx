import React from "react";
import PropTypes from "prop-types";
import blueGrey from "@material-ui/core/colors/blueGrey";
import grey from "@material-ui/core/colors/grey";
import purple from "@material-ui/core/colors/purple";
import { hot } from "react-hot-loader";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: "inherit"
  },
  palette: {
    text: {
      primary: grey[400],
    },
    primary: {
      main: grey[800],
      dark: purple[200]
    },
    secondary: {
      main: blueGrey[200]
    },
    type: "dark",
    background: {
      default: "#1b1b1b",
      // paper: grey[700]
    }
  },
  drawerWidth: 260
});

console.log(theme);

const Theme = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    <>
      <CssBaseline />
      {children}
    </>
  </MuiThemeProvider>
);

Theme.propTypes = {
  children: PropTypes.element.isRequired
};

export default hot(module)(Theme);
