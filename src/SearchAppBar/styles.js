import { createStyles } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";

/** @param {import("@material-ui/core").Theme} theme */
const styles = theme => createStyles({
  transparentBar: {
    background: "transparent",
    boxShadow: "none",
    pointerEvents: "none"
  },
  fixedGutter: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  allPointerEvents: {
    pointerEvents: "all"
  },
  root: {
    width: "100%",
  },
  grow: {
    flexGrow: 0,
    transition: theme.transitions.create("flex-grow", {
      duration: "500ms"
    }),
    [theme.breakpoints.up("sm")]: {
      flexGrow: 1,
    },
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    display: "flex",
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
  },
  searchIcon: {
    width: theme.spacing.unit * 6,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    // paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 6,
    transition: `${theme.transitions.create("background", {
      duration: "500ms",
    })}, ${theme.transitions.create("width", {
      duration: "500ms",
    })}`,
    "&:focus": {
      backgroundColor: fade(theme.palette.common.white, 0.15),
    },
    borderRadius: "4px",
    width: `calc(100vw - ${theme.spacing.unit * 16}px)`,
    [theme.breakpoints.up("sm")]: {
      // transition: `${theme.transitions.create("background", {
      //   duration: "500ms",
      // })}, ${theme.transitions.create("width", {
      //   duration: "500ms",
      // })}`,
      width: "0vw",
      "&:focus": {
        width: 200,
      },
    },
  },
});

export default styles;
