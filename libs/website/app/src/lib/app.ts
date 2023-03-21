import { app } from '@astro-nx-depla/shared/app';
import { contentProvider } from '@astro-nx-depla/shared/util/astro';

contentProvider(app);

export { app };
