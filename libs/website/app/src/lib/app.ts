import { Container } from '@astro-nx-depla/shared/container';
import { provider as environmentProvider } from './providers/environment';
import { provider as configProvider } from './providers/config';
import { provider as dbProvider } from './providers/db';
import { provider as postProvider } from './providers/post';

export const app = new Container();

environmentProvider(app);
configProvider(app);
dbProvider(app);
postProvider(app);
