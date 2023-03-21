import { db } from './db';

export const provider = (c) => {
  c.service('db', (c) => db);
};
