export interface OptionAttrMap {
  prefix: string;
  attributes: string[];
  replace?: string;
}

export interface Options {
  import?: { module: string; export: string };
  tag?: string;
  attributes?: Array<OptionAttrMap | { preset?: 'lit-html' | 'global' }>;
  define?: string;
  quotedAttributes?: boolean;
}