import Dexie from "dexie";

const cursedCsvUrl =
  "https://docs.google.com/spreadsheets/d/1ehUKvA3bdcZmYnPxTMgoQeOKSkqdt0N10f4HK8rk_PM/export?format=csv";

class CursedDB extends Dexie {
  sites: Dexie.Table<ISite, number>;

  constructor() {
    super("CursedDB");
    this.version(1).stores({
      sites: "++id, url, title, description, lastViewed",
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
}

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

  static populate() {
    const req = new Request(cursedCsvUrl);
    const res = fetch();
  }
}

export const db = new CursedDB();
db.sites.mapToClass(Site);
