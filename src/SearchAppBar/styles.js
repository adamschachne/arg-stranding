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
    fixedGutter: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    allPointerEvents: {
      pointerEvents: "all"
    },
    grow: {
      flexGrow: 0,
      transition: theme.transitions.create("flex-grow", {
        duration: "500ms"
      }),
      [theme.breakpoints.up("sm")]: {
        flexGrow: 1
      }
    },
    search: {
      display: "flex",
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      marginLeft: 0
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
      // paddingRight: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(6),
      transition: `${theme.transitions.create("background", {
        duration: "500ms"
      })}, ${theme.transitions.create("width", {
        duration: "500ms"
      })}`,
      "&:focus": {
        backgroundColor: fade(theme.palette.common.white, 0.15)
      },
      borderRadius: "4px",
      width: `calc(100vw - ${theme.spacing(16)}px)`,
      [theme.breakpoints.up("sm")]: {
        // transition: `${theme.transitions.create("background", {
        //   duration: "500ms",
        // })}, ${theme.transitions.create("width", {
        //   duration: "500ms",
        // })}`,
        width: "0vw",
        "&:focus": {
          width: 200
        }
      }
    },
    appBar: {
      width: "100%"
    },
    spacerDrawerOpen: {
      width: theme.drawerWidth - theme.spacing(6),
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    spacerDrawerClosed: {
      width: "0px",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    }
  });

export default styles;
