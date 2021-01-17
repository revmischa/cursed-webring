import * as React from "react";
import { doSitesExist, populateDb } from "../Model/DB";

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
    })();
  }, []);

  return {
    isLoading,
  };
}
