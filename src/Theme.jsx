import React from "react";
import { hot } from "react-hot-loader/root";
import PropTypes from "prop-types";
import blueGrey from "@material-ui/core/colors/blueGrey";
import grey from "@material-ui/core/colors/grey";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

// this needs to be exported so react-hot-loader can persist it
export const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: "inherit",
    fontWeightRegular: 600,
    fontWeightMedium: 600,
    fontWeightLight: 600
  },
  palette: {
    text: {
      primary: grey[400]
      // primary: purple[800]
    },
    primary: {
      main: grey[800]
    },
    secondary: {
      main: blueGrey[100]
    },
    type: "dark",
    background: {
      default: "#1b1b1b",
      paper: grey[800]
    }
  },
  drawerWidth: 260
});

console.log(theme);

const Theme = ({ children }) => (
  <ThemeProvider theme={theme}>
    <>
      <CssBaseline />
      {children}
    </>
  </ThemeProvider>
);

Theme.propTypes = {
  children: PropTypes.element.isRequired
};

export default hot(Theme);
