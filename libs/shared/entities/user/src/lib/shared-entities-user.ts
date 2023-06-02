import { User as UserGeneratedModel } from '@sergeylukin/shared/generated/entities/user';
import { config } from './shared-entities-user-config';

export function User(app) {
  const userModel = UserGeneratedModel(app, config)

  return Object.assign(userModel, {
    /**
     * Custom method (feel free to modify / remove)
     */
    getSomething() {
      return 'you just called user.getSomething() method'
    },
  });
}
