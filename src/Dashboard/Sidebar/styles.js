import { createStyles } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import image from "../../assets/sidebar.png";

/** @param {import("@material-ui/core").Theme} theme */
const styles = (theme) => {
  return createStyles({
    drawer: {
      // width: theme.drawerWidth,
      flexShrink: 0,
      userSelect: "none"
    },
    drawerPaper: {
      width: theme.drawerWidth,
      border: "none",
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      // padding: "0 8px",
      height: theme.spacing.unit * 6,
      justifyContent: "flex-end",
    },
    logo: {
      display: "flex",
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
      height: theme.spacing.unit * 6,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -theme.drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    background: {
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center center",
      "&:before": {
        zIndex: -1,
        position: "absolute",
        width: "100%",
        height: "100%",
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
      padding: theme.spacing.unit * 3,
      flex: 1,
    },
    dividerRoot: {
      backgroundColor: fade(theme.palette.secondary.main, 0.5)
    }
  });
};

export default styles;
