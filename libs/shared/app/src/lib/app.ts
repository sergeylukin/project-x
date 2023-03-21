import { Container } from '@astro-nx-depla/shared/util/IOC';

import { provider as environmentProvider } from '@astro-nx-depla/shared/util/environment';
import { provider as configProvider } from '@astro-nx-depla/website/config';
import { provider as routeProvider } from '@astro-nx-depla/shared/util/route';
import { provider as dbProvider } from '@astro-nx-depla/shared/util/db';

import { provider as postProvider } from '@astro-nx-depla/shared/entities/post';
import { provider as userProvider } from '@astro-nx-depla/shared/entities/user';

export const app = new Container();

environmentProvider(app);
configProvider(app);
routeProvider(app);
dbProvider(app);

postProvider(app);
userProvider(app);
