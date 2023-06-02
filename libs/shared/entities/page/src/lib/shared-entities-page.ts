import { Page as PageGeneratedModel } from '@sergeylukin/shared/generated/entities/page';
import { config } from './shared-entities-page-config';

export function Page(app) {
  const pageModel = PageGeneratedModel(app, config)

  return Object.assign(pageModel, {
    /**
     * Custom method (feel free to modify / remove)
     */
    getSomething() {
      return 'you just called page.getSomething() method'
    },
  });
}
