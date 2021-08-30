import openTracing from './helpers/lightStep/lightStepProvider';
import { Span } from 'opentracing';
import { sentry } from './helpers/sentry';
import express from 'express';
import apolloServer from './apolloServer';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import * as bodyParser from 'body-parser';
import { Environments } from './config/environments';
import healthRouter from './application/routes/health';
import publicRouter from './application/routes/public';
import router from './application/routes/router';
import errorHandlerMiddleware from './application/middlewares/errorHandlerMiddleware';
import loadDataSourcesMiddleware from './application/middlewares/loadDataSourcesMiddleware';
import Context from './application/context';
import firewall from './application/middlewares/firewallMiddleware';
import { UserDto } from './models/dto/userDto';

declare global {
  namespace Express {
    interface Request {
      context: Context;
      user: UserDto;
    }
  }
  namespace NodeJS {
    interface Global {
      __rootdir__: string;
    }
  }
}
global.__rootdir__ = __dirname || process.cwd();

sentry.initSentry();
const span: Span = new openTracing.Span();

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(loadDataSourcesMiddleware);
app.use('/', healthRouter);
app.use('/public', publicRouter);
app.use('/voyager', voyagerMiddleware({ endpointUrl: '/kw-connect-next-api/graphql' }));
app.use(
  '/api',
  firewall,
  router
);
app.disable('x-powered-by');

app.use(errorHandlerMiddleware);

apolloServer.applyMiddleware({ app });

const port = Environments.serverPort;

const transaction = sentry.startTransaction('Starting service','Starting kw-connect-next-api');

app.listen(port, () => {
  try {
    process.stdout.write(`🚀... Server ready, on port ${port}\n`);
    process.stdout.write(`🚀... Server ready, http://localhost:${port}${apolloServer.graphqlPath}`);
  } catch (exception) {
    sentry.captureException(exception);
    process.stdout.write(exception);
  } finally {
    transaction.finish();
  }

  span.finish();
});
