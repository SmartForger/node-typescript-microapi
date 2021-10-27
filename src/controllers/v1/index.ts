import express from 'express';
import { HealthController } from './health.controller';
import { PeopleController } from './people.controller';

const router = express.Router();

router.use('/people', new PeopleController().getRoutes());
router.use('/health', new HealthController().getRoutes());

export default router;
