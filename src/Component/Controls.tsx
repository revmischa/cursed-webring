import * as React from "react";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import { ViewSiteContext } from "../Context/ViewSiteContext";
import classNames from "classnames";

const useStyles = makeStyles({
  root: {
    position: "absolute",
    bottom: "0rem",
    margin: "1rem",
    // height: "3rem",
    display: "flex",
    width: "95%",
    justifyContent: "space-between",
  },
  glowBtn: {
    boxShadow: "0 0 20px 5px #1d0444",
  },
  prevBtn: {
    marginLeft: "1rem",
    transform: "rotate(2deg)",
  },
  nextBtn: { transform: "rotate(-1.6deg)", marginRight: "3rem" },
});

interface IControlsProps {}

const Controls = (props: IControlsProps) => {
  const classes = useStyles();
  const viewSiteCtx = React.useContext(ViewSiteContext);

  const handleClickPrev = React.useCallback(() => {
    viewSiteCtx.viewPrevSite();
  }, [viewSiteCtx]);
  const handleClickNext = React.useCallback(() => {
    viewSiteCtx.viewNextSite();
  }, [viewSiteCtx]);

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickPrev}
        className={classNames(classes.glowBtn, classes.prevBtn)}
      >
        Prev
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={handleClickNext}
        className={classNames(classes.glowBtn, classes.nextBtn)}
      >
        Next
      </Button>
    </div>
  );
};

export default Controls;
