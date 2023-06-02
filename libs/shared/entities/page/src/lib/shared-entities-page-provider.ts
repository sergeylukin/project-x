import { Page } from './shared-entities-page';

export const provider = (c) => {
  c.service('page', (c) => Page(c));
};
