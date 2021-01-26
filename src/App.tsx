import { CircularProgress } from "@material-ui/core";
import * as React from "react";
import Controls from "./Component/Controls";
import SiteViewer from "./Component/SiteViewer";
import {
  useNewViewSiteContext,
  ViewSiteContext,
} from "./Context/ViewSiteContext";
import { useLoadDatabase } from "./Hook/DBLoader";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  main: {
    margin: 0,
    padding: 0,
    height: "100vh",
    overflow: "hidden",
  },
  loadingContainer: {
    margin: 0,
    padding: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    width: 128,
    height: 128,
  },
});

function App() {
  const classes = useStyles();

  const { isLoading: isDBLoading } = useLoadDatabase();
  const { viewSiteContext, handleViewNextSite } = useNewViewSiteContext();

  React.useEffect(() => {
    (async () => {
      if (isDBLoading) return;
      handleViewNextSite();
    })();
  }, [isDBLoading, handleViewNextSite]);

  return (
    <main className={classes.main}>
      {isDBLoading || !viewSiteContext.currentSite ? (
        <div className={classes.loadingContainer}>
          <CircularProgress size={128} className={classes.spinner} />
        </div>
      ) : (
        <ViewSiteContext.Provider value={viewSiteContext}>
          <SiteViewer />
          <Controls />
        </ViewSiteContext.Provider>
      )}
    </main>
  );
}

export default App;
