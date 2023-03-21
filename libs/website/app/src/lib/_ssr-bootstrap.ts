// This file is injected into every SSR module by astro
// see astro.config.ts
import { app as APP_FOR_SEED } from '@astro-nx-depla/website/app';
APP_FOR_SEED.user.seed();
APP_FOR_SEED.post.seed();
