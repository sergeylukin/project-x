import { IOC } from '@astro-nx-depla/shared/util/IOC';
import { provider as postProvider } from '@astro-nx-depla/shared/entities/post';
import { provider as userProvider } from '@astro-nx-depla/shared/entities/user';

export const app = IOC;

postProvider(app);
userProvider(app);
