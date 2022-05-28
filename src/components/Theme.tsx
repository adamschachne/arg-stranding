import { hot } from "react-hot-loader/root";
import React, { ElementType } from "react";
import blueGrey from "@material-ui/core/colors/blueGrey";
import grey from "@material-ui/core/colors/grey";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";
import { PaletteType } from "@material-ui/core";
import { SettingsConsumer } from "./Settings/SettingsContext";

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    drawerWidth: number;
  }
  // allow configuration using `createMuiTheme`
}

interface ThemeOptionsExtended extends ThemeOptions {
  drawerWidth: number;
}

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  themeType: PaletteType;
  children: ElementType<any>;
}

const themeDefaults: ThemeOptionsExtended = {
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
class Theme extends React.PureComponent<Props> {
  render() {
    const { themeType, children } = this.props;
    const theme = createMuiTheme({
      ...themeDefaults,
      palette: { ...themeDefaults.palette, type: themeType }
    });
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

type ThemeContainerProps = {
  children: ElementType<any> & React.ReactNode;
};

const ThemeContainer = ({ children }: ThemeContainerProps) => (
  /* extract theme related options from settings */
  <SettingsConsumer>
    {({ themeType }) => <Theme themeType={themeType}>{children}</Theme>}
  </SettingsConsumer>
);

export default hot(ThemeContainer);
