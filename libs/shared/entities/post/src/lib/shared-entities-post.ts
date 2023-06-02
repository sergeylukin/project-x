import { Post as PostGeneratedModel } from '@sergeylukin/shared/generated/entities/post';
import { config } from './shared-entities-post-config';

export function Post(app) {
  const postModel = PostGeneratedModel(app, config)

  return Object.assign(postModel, {
    /**
     * Custom method (feel free to modify / remove)
     */
    getSomething() {
      return 'you just called post.getSomething() method'
    },
  });
}
