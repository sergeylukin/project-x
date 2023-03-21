import { app } from '@astro-nx-depla/shared/app';
import { collectionsProvider } from '@astro-nx-depla/shared/util/astro-collections-facade';

collectionsProvider(app);

export { app };
