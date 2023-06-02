import { app } from '@sergeylukin/shared/app';


import { provider as configProvider } from '@sergeylukin/website/config';

import { provider as envProvider } from '@depla/utils-environment';

import { provider as dbProvider } from '@depla/utils-db';

import { provider as userProvider } from '@sergeylukin/shared/entities/user';

import { provider as tagProvider } from '@sergeylukin/shared/entities/tag';

import { provider as postProvider } from '@sergeylukin/shared/entities/post';

import { provider as pageProvider } from '@sergeylukin/shared/entities/page';



configProvider(app);

envProvider(app);

dbProvider(app);

userProvider(app);

tagProvider(app);

postProvider(app);

pageProvider(app);



export { app };
