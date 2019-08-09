import { createStyles } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";

/** @param {import("@material-ui/core").Theme} theme */
const styles = (theme) =>
  createStyles({
    transparentBar: {
      background: "transparent",
      boxShadow: "none",
      pointerEvents: "none"
    },
    noGutter: {
      paddingLeft: 0,
      paddingRight: 0
    },
    allPointerEvents: {
      pointerEvents: "all"
    },
    noPointerEvents: {
      pointerEvents: "none"
    },
    grow: {
      flexGrow: 1
      // transition: theme.transitions.create("flex-grow", {
      //   duration: "500ms"
      // }),
      // [theme.breakpoints.up("sm")]: {
      //   flexGrow: 1
      // }
    },
    search: {
      display: "flex",
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      marginLeft: 0,
      paddingRight: 12
    },
    searchIcon: {
      width: theme.spacing(6),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    inputRoot: {
      color: "inherit",
      width: "100%"
    },
    inputInput: {
      paddingTop: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(6) - 21,
      transition: `${theme.transitions.create(["background", "padding-left", "width"], {
        duration: "300ms"
      })}`,
      borderRadius: "4px",
      width: "0vw"
    },
    inputInputFocused: {
      backgroundColor: fade(theme.palette.common.white, 0.15),
      paddingLeft: theme.spacing(6),
      // 14.5 units accounts for the padding around the input and the drawer button
      width: `calc(100vw - ${theme.spacing(14.5)}px)`,
      [theme.breakpoints.up("sm")]: {
        width: 200
      }
    },
    appBar: {
      width: "100%",
      overflow: "hidden",
      transition: "none"
    },
    spacerDrawerOpen: {
      marginLeft: theme.drawerWidth - theme.spacing(6),
      transition: theme.transitions.create("margin-left", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    spacerDrawerClosed: {
      marginLeft: "0px",
      transition: theme.transitions.create("margin-left", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    title: {
      paddingLeft: theme.spacing(1)
    },
    paper: {
      position: "absolute",
      zIndex: 1,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0
    },
    menuRoot: {
      zIndex: 1199,
      position: "absolute",
      top: theme.spacing(6),
      left: 0
    },
    back: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: "100vw",
      height: `calc(100vh - ${theme.spacing(6)}px)`,
      display: "inline-block",
      transition: theme.transitions.create("background", {
        duration: "300ms"
      })
    },
    fade: {
      background: "rgba(0, 0, 0, 0.5)"
    },
    menuPaper: {
      zIndex: 1,
      top: theme.spacing(2),
      width: `calc(100vw - ${theme.spacing(4)}px)`,
      left: theme.spacing(2)
    },
    menuPaperShifted: {
      width: `calc(100vw - ${theme.drawerWidth + theme.spacing(4)}px)`,
      left: theme.drawerWidth + theme.spacing(2)
    }
  });

export default styles;
