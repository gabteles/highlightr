import Dexie, { Table } from 'dexie';
import 'dexie-observable';
import { Highlight } from '../types/Highlight';

class HighlightStore extends Dexie {
  public highlights!: Table<Highlight>;

  constructor() {
    super('highlightr');

    this.version(2).stores({
      highlights: '$$uuid, url, createdAt, text',
    });
  }
}

const instance = new HighlightStore();
export default instance;
