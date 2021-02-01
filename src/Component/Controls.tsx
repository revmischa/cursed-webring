import * as React from "react";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import { ViewSiteContext } from "../Context/ViewSiteContext";
import classNames from "classnames";
import { Dialog, DialogContent } from "@material-ui/core";
import SubmitForm from "./SubmitForm";

const useStyles = makeStyles({
  root: {
    position: "absolute",
    bottom: "0rem",
    margin: "1rem",
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
  submitBtn: { transform: "rotate(.8deg)" },
});

interface IControlsProps {}

const Controls = (props: IControlsProps) => {
  const classes = useStyles();
  const { viewNextSite, viewPrevSite } = React.useContext(ViewSiteContext);

  const handleClickPrev = React.useCallback(() => {
    viewPrevSite();
  }, [viewPrevSite]);
  const handleClickNext = React.useCallback(() => {
    viewNextSite();
  }, [viewNextSite]);

  const [submitDialogVisible, setSubmitDialogVisible] = React.useState(false);

  return (
    <div className={classes.root}>
      <Dialog open={submitDialogVisible}>
        <DialogContent>
          <SubmitForm onDone={() => setSubmitDialogVisible(false)} />
        </DialogContent>
      </Dialog>

      <Button
        variant="contained"
        color="primary"
        onClick={handleClickPrev}
        className={classNames(classes.glowBtn, classes.prevBtn)}
      >
        🤛
      </Button>

      <Button
        variant="contained"
        size="small"
        color="secondary"
        onClick={() => setSubmitDialogVisible(true)}
        className={classNames(classes.glowBtn, classes.submitBtn)}
      >
        Submit
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={handleClickNext}
        className={classNames(classes.glowBtn, classes.nextBtn)}
      >
        🤜
      </Button>
    </div>
  );
};

export default Controls;
