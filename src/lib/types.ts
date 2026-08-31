export type CollectionStatus = "published" | "draft" | "planned";

export type CatalogItem = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  status: CollectionStatus;
  featured?: boolean;
  summary: string;
  tags: string[];
  updated: string;
  viewer: "ga-catalog" | "article";
  entry: string;
  section?: string;
};

export type Catalog = {
  site: {
    name: string;
    fullName: string;
    tagline: string;
    description: string;
    locale: string;
  };
  nav: { id: string; label: string; href: string }[];
  categories: { id: string; label: string }[];
  collections: Array<CatalogItem & { section?: string }>;
};

export type GaEvent = {
  name: string;
  label: string;
  look: string;
  when: string;
  extra: string;
  tone: string;
};

export type GaGroup = {
  id: string;
  title: string;
  note?: string;
  events: GaEvent[];
};
