import express from 'express';
import { Environments } from './config/environments';
import { PeopleController } from './controllers/people.controller';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/people', new PeopleController().getRoutes());

app.use('/', (req, res) => {
  res.send('API is running ...');
});

const port = Environments.serverPort;

app.listen(port, () => {
  try {
    process.stdout.write(`🚀... Server ready, on port ${port}\n`);
  } catch (exception) {
    process.stdout.write(exception);
  }
});
