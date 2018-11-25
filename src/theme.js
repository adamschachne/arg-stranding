import blueGrey from "@material-ui/core/colors/blueGrey";
import grey from "@material-ui/core/colors/grey";
import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    text: {
      primary: grey[300]
    },
    primary: {
      main: grey[800],
    },
    secondary: {
      main: blueGrey[200]
    }
  },
  drawerWidth: 260
});

console.log(theme);

export default theme;
