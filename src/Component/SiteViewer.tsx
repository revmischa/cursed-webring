import * as React from "react";
import { makeStyles } from "@material-ui/styles";
import { ViewSiteContext } from "../Context/ViewSiteContext";

const useStyles = makeStyles({
  iframe: {
    margin: 0,
    padding: 0,
    width: "100%",
    height: "100%",
  },
});

interface ISiteViewerProps {}

const SiteViewer = (props: ISiteViewerProps) => {
  const classes = useStyles();
  const viewSiteCtx = React.useContext(ViewSiteContext);
  const currentSite = React.useMemo(() => viewSiteCtx.currentSite, [
    viewSiteCtx?.currentSite,
  ]);

  if (!currentSite?.url) return null;

  return (
    <iframe
      title="Cursed Frame"
      src={currentSite.url}
      className={classes.iframe}
    />
  );
};

export default SiteViewer;
