import { Container } from './container';
import { provider as environmentProvider } from './providers/environment';
import { provider as configProvider } from './providers/config';
import { provider as routeProvider } from './providers/route';
import { provider as dbProvider } from './providers/db';
import { provider as postProvider } from './providers/post';

export const IOC = new Container();

environmentProvider(IOC);
configProvider(IOC);
routeProvider(IOC);
dbProvider(IOC);
