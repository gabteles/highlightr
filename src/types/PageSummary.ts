export type PageSummary = {
  url: string;
  loading: boolean;
  summary: string | null;
  tags: string[];
  highlightIds: string[];
};
