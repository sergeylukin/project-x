import { IOC } from '@astro-nx-depla/shared/IOC';
import { provider as postProvider } from '@astro-nx-depla/website/entities/post';
import { provider as userProvider } from '@astro-nx-depla/website/entities/user';

export const app = IOC;

postProvider(app);
userProvider(app);
