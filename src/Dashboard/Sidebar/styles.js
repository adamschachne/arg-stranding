import { createStyles } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import image from "../../assets/sidebar.png";

/** @param {import("@material-ui/core").Theme} theme */
const styles = (theme) => {
  return createStyles({
    drawer: {
      // width: theme.drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: theme.drawerWidth,
      border: "none"
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      // padding: "0 8px",
      height: theme.spacing(6),
      justifyContent: "flex-end"
    },
    logo: {
      display: "flex",
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
      height: theme.spacing(6)
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      marginLeft: -theme.drawerWidth
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    },
    background: {
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center center",
      "&:before": {
        zIndex: -1,
        position: "absolute",
        width: "100%",
        height: "100vh",
        content: `""`,
        background: "#000",
        opacity: "0.5"
      }
    },
    end: {
      position: "absolute",
      right: 0
    },
    sidebarMenu: {
      // padding: theme.spacing(1.5),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      paddingTop: theme.spacing(1) - 1, // 1px to account for divider
      flex: 1
    },
    dividerRoot: {
      backgroundColor: fade(theme.palette.secondary.main, 0.6)
    },
    menuButton: {
      marginTop: theme.spacing(1)
    },
    noSelect: {
      userSelect: "none",
      "-webkit-user-drag": "none"
    },
    bold: {
      fontWeight: 600
    }
  });
};

export default styles;
