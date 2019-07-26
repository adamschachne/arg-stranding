import { hot } from "react-hot-loader/root";
import React from "react";
import PropTypes from "prop-types";
import blueGrey from "@material-ui/core/colors/blueGrey";
import grey from "@material-ui/core/colors/grey";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { SettingsConsumer } from "./Settings/SettingsContext";

/** @type {import("@material-ui/core/styles/createMuiTheme").ThemeOptions} */
const themeDefaults = {
  typography: {
    fontFamily: "'Source Sans Pro', sans-serif;",
    fontWeightRegular: 400,
    fontWeightMedium: 400,
    fontWeightLight: 400
  },
  palette: {
    // text: {
    //   primary: grey[400]
    //   // primary: purple[800]
    // },
    primary: {
      main: grey[800]
    },
    secondary: {
      main: blueGrey[100]
    },
    type: "dark"
    // background: {
    //   default: "#1b1b1b",
    //   paper: grey[800]
    // }
  },
  drawerWidth: 260
};

// providing a new theme is expensive, so this should not be rendered often
class Theme extends React.PureComponent {
  render() {
    const { themeType, children } = this.props;
    const theme = createMuiTheme(
      Object.assign({}, themeDefaults, {
        palette: { ...themeDefaults.palette, type: themeType }
      })
    );
    console.log("theme render", theme);
    return (
      <ThemeProvider theme={theme}>
        <>
          <CssBaseline />
          {children}
        </>
      </ThemeProvider>
    );
  }
}

Theme.propTypes = {
  themeType: PropTypes.oneOf(["dark", "light"]).isRequired,
  children: PropTypes.element.isRequired
};

const ThemeContainer = ({ children }) => (
  <SettingsConsumer>
    {/* extract theme related options from settings */}
    {({ themeType }) => <Theme themeType={themeType}>{children}</Theme>}
  </SettingsConsumer>
);

ThemeContainer.propTypes = {
  children: PropTypes.element.isRequired
};

export default hot(ThemeContainer);
