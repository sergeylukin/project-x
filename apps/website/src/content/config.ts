import { defineCollection } from 'astro:content';
import { postCollection } from '@sergeylukin/shared/entities/post';

export const collections = {
  post: defineCollection(postCollection),
};
