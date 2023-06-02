import { Tag as TagGeneratedModel } from '@sergeylukin/shared/generated/entities/tag';
import { config } from './shared-entities-tag-config';

export function Tag(app) {
  const tagModel = TagGeneratedModel(app, config)

  return Object.assign(tagModel, {
    /**
     * Custom method (feel free to modify / remove)
     */
    getSomething() {
      return 'you just called tag.getSomething() method'
    },
  });
}
