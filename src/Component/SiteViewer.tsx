import * as React from "react";
import { makeStyles } from "@material-ui/styles";
import { ViewSiteContext } from "../Context/ViewSiteContext";

const proxyEnabled = false;

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

  let url = currentSite.url;
  if (proxyEnabled) {
    const searchParams = new URLSearchParams({ url: currentSite.url });
    url = new URL(
      `https://0yzvtxmzhc.execute-api.eu-west-1.amazonaws.com/prod/proxy?${searchParams}`
    ).toString();
  }

  return <iframe title="Cursed Frame" src={url} className={classes.iframe} />;
};

export default SiteViewer;
