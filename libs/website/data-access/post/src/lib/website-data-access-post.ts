import { CONFIG } from '@astro-nx-depla/shared/util/config-provider';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Post } from '@astro-nx-depla/website/types';
import {
  cleanSlug,
  trimSlash,
  generatePermalink,
} from '@astro-nx-depla/shared/util/formatting';

const PostConfig = CONFIG.get('entities.post');
