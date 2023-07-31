import Dexie, { Table } from 'dexie';
import 'dexie-observable';
import { Highlight } from '../types/Highlight';
import { PageSummary } from '../types/PageSummary';

class HighlightStore extends Dexie {
  public highlights!: Table<Highlight>;
  public config!: Table<{ name: string, value: unknown }>;
  public summary!: Table<PageSummary>;

  constructor() {
    super('highlightr');

    this.version(5).stores({
      highlights: '$$uuid, url, createdAt, text, container, anchorNode, anchorOffset, focusNode, focusOffset',
      config: '$$name, value',
      summary: '$$url, loading, summary, tags, highlightIds',
    });
  }
}

const instance = new HighlightStore();
export default instance;
