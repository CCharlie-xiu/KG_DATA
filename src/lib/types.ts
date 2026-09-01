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
  viewer: "ga-catalog" | "article" | "arch-spec";
  entry: string;
  section?: string;
  cover?: string;
};

export type Catalog = {
  site: {
    name: string;
    fullName: string;
    tagline: string;
    description: string;
    locale: string;
    defaultCover?: string;
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

export type ArticleSection = {
  heading?: string;
  body: string;
};

/** collections/<id>/meta.json（viewer: article） */
export type ArticleMeta = {
  id: string;
  title: string;
  status?: CollectionStatus;
  sourceProject?: string;
  notes?: string[];
  /** 轻量 Markdown 正文 */
  body?: string;
  /** 分段正文；与 body 二选一，优先 sections */
  sections?: ArticleSection[];
};
