import * as React from "react";
import { getNextSiteToView, getPrevSiteToView, Site } from "../Model/DB";

export interface IViewSiteContext {
  currentSite?: Site;
  viewPrevSite(): void;
  viewNextSite(): void;
}

export const ViewSiteContext = React.createContext<IViewSiteContext>({
  viewNextSite: async () => {},
  viewPrevSite: async () => {},
});

/**
 * Create a new context to hold current site selection state
 */
export function useNewViewSiteContext() {
  // "next site" handler
  const handleViewNextSite = React.useCallback(async () => {
    const newSite = await getNextSiteToView();
    setViewSiteContext((ctx: IViewSiteContext) => ({
      ...ctx,
      currentSite: newSite,
    }));
  }, []);

  // "prev site" handler
  const handleViewPrevSite = React.useCallback(async () => {
    const newSite = await getPrevSiteToView();
    setViewSiteContext((ctx: IViewSiteContext) => ({
      ...ctx,
      currentSite: newSite,
    }));
  }, [handleViewNextSite]);

  // create our ViewSiteContext
  const [
    viewSiteContext,
    setViewSiteContext,
  ] = React.useState<IViewSiteContext>({
    viewPrevSite: handleViewPrevSite,
    viewNextSite: handleViewNextSite,
  });

  return { viewSiteContext, handleViewPrevSite, handleViewNextSite };
}
