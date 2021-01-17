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
        <CircularProgress size={128} />
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
