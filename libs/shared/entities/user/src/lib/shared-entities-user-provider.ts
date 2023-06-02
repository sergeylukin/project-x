import { User } from './shared-entities-user';

export const provider = (c) => {
  c.service('user', (c) => User(c));
};
