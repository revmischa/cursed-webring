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

  const searchParams = new URLSearchParams({ url: currentSite.url });
  const proxiedUrl = new URL(
    `https://0yzvtxmzhc.execute-api.eu-west-1.amazonaws.com/prod/proxy?${searchParams}`
  );

  return (
    <iframe
      title="Cursed Frame"
      src={proxiedUrl.toString()}
      className={classes.iframe}
    />
  );
};

export default SiteViewer;
