import Dexie, { Table } from 'dexie';
import 'dexie-observable';
import { Highlight } from '../types/Highlight';
import { PageSummary } from '../types/PageSummary';

class IndexedDbStore extends Dexie {
  public highlights!: Table<Highlight>;
  public config!: Table<{ name: string, value: unknown, updatedAt: number }>;
  public summary!: Table<PageSummary>;

  constructor() {
    super('highlightr');

    this.version(6).stores({
      highlights: '$$uuid, url, createdAt, text, container, anchorNode, anchorOffset, focusNode, focusOffset',
      config: '$$name, value, updatedAt',
      summary: '$$url, loading, summary, tags, highlightIds',
    });
  }
}

const instance = new IndexedDbStore();
export default instance;
