export type Market = 'cn' | 'us';

export type PanelDef = {
  key: string;
  title: string;
  description: string;
  lead?: string;
  apiPath: string;
  chart: {
    id: string;
    title: string;
    description?: string;
    height?: string;
  };
  howToRead?: string;
  keyFindings?: string[];
  sources?: string[];
  relatedKeys?: string[];
};

export type HubSectionDef = {
  sectionNumber: string;
  title: string;
  description?: string;
  panelKeys: string[];
};

export type HubDef = {
  market: Market;
  module: string;
  slug: string;
  lang: 'zh-CN' | 'en';
  title: string;
  description: string;
  heroTitle: string;
  heroDescription: string;
  sections: HubSectionDef[];
  panels: Record<string, PanelDef>;
  related?: Array<{ href: string; title: string; description?: string }>;
};

