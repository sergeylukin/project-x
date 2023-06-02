import { app } from '@sergeylukin/website/generated/app';
import { collectionsProvider } from '@depla/utils-astro-collections-facade';

// Your custom business logic

collectionsProvider(app);

export { app };
