import * as React from "react";
import { doSitesExist, populateDb } from "../Model/DB";

declare global {
  interface Window {
    stopCursedBackground: boolean;
  }
}

/**
 * Update database of sites with data from API
 */
export function useLoadDatabase() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      // do we have some sites cached?
      doSitesExist().then((doesExist) => doesExist && setIsLoading(false));

      // fetch sites regardless
      await populateDb();
      setIsLoading(false);

      // turn off intro shader
      window.setTimeout(() => (window.stopCursedBackground = true), 1500);
    })();
  }, []);

  return {
    isLoading,
  };
}
