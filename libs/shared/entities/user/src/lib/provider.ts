import { User } from './entity';

export const provider = (c) => {
  c.service('user', (c) => User(c));
};
