import Dexie from "dexie";

const cursedSitesUrl =
  "https://0yzvtxmzhc.execute-api.eu-west-1.amazonaws.com/prod/sites/";

class CursedDB extends Dexie {
  sites: Dexie.Table<ISite, number>;

  constructor() {
    super("CursedDB");
    this.version(1).stores({
      sites: "++id, &url, title, description, *lastViewed",
    });

    this.sites = this.table("sites");
  }
}

interface ISite {
  id?: number;
  url: string;
  title: string;
  description: string;
  lastViewed: Date;

  markUnviewed(): Promise<void>;
  markViewed(): Promise<void>;
}

// fields from the server to keep in sync
// const serverMetaFields = ["title", "description"];

export class Site implements ISite {
  id?: number;
  url: string;
  title: string;
  description: string;
  lastViewed: Date;

  constructor(
    url: string,
    title: string,
    description: string,
    lastViewed: Date
  ) {
    this.url = url;
    this.title = title;
    this.description = description;
    this.lastViewed = lastViewed;
  }

  static async populate() {
    const req = new Request(cursedSitesUrl, { mode: "cors" });
    const res = await fetch(req);
    const allFetchedSites: ISite[] = await res.json();
    console.debug("Fetched", allFetchedSites);

    // merge fetched with existing sites
    const allExistingSites = await db.sites.toArray();
    const allFetchedUrls = allFetchedSites.map((site) => site.url);

    for (const existingSite of allExistingSites) {
      // handle deleted sites
      if (existingSite.id && !allFetchedUrls.includes(existingSite.url)) {
        // site was removed
        console.debug("removed", existingSite);
        db.sites.delete(existingSite.id);
      }
    }

    for (const fetchedSite of allFetchedSites) {
      const existing = allExistingSites.find(
        (site) => site.url === fetchedSite.url
      );
      if (!existing) {
        // new site
        console.debug("adding new site", fetchedSite);
        db.sites.add({ ...fetchedSite, lastViewed: new Date(0) }); // date must be set to order by it
      } else {
        // we already have the site, update it
        console.debug("updating existing site", fetchedSite);
        db.sites.update(existing, fetchedSite);
      }
    }
  }

  async markViewed() {
    db.sites.update(this, { lastViewed: new Date() });
  }
  async markUnviewed() {
    db.sites.update(this, { lastViewed: new Date(0) });
  }
}

export const populateDb = async () => Promise.all([Site.populate()]);

export const doSitesExist = async (): Promise<Boolean> =>
  !!(await db.sites.count());

/**
 * Get next site to view, by last viewed time
 */
export const getNextSiteToView = async (): Promise<ISite | undefined> => {
  const site = await db.sites.orderBy("lastViewed").first(); // least recently viewed
  if (site) site.markViewed(); // mark viewed
  return site;
};

export const getPrevSiteToView = async (): Promise<ISite | undefined> => {
  let prevSite;
  await db.transaction("rw", db.sites, async () => {
    const firstSite = await db.sites.orderBy("lastViewed").first(); // least recently viewed
    prevSite = await db.sites.orderBy("lastViewed").last(); // most recently viewed

    if (prevSite && firstSite) {
      // reset most recently viewed to less recent than first
      prevSite.lastViewed = new Date(firstSite.lastViewed.getTime() - 10000);
      await db.sites.put(prevSite);
    }

    // get new most recent
    prevSite = await db.sites.orderBy("lastViewed").last();
  });

  return prevSite;
};

export const db = new CursedDB();
db.sites.mapToClass(Site);
