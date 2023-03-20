import { app } from '@astro-nx-depla/shared/app';
import { provider as contentProvider } from '@astro-nx-depla/shared/providers/content-astro';

contentProvider(app);

export { app };
