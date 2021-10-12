import express from 'express';
import { HealthController } from './controllers/health.controller';
import { PeopleController } from './controllers/people.controller';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/public', express.static('public'));

app.use('/people', new PeopleController().getRoutes());
app.use('/health', new HealthController().getRoutes());

app.use('/', (req, res) => {
  res.send('API is running...');
});

export default app;
