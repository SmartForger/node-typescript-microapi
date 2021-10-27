import { createLogger, transports, format } from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { Environments } from '../config/environments';

const loggingWinston = new LoggingWinston({
  projectId: Environments.gcpProjectId,
  labels: {
    service: 'colo',
  },
});

const colorizer = format.colorize();

const loggerTransports =
  Environments.nodeEnv === 'production' || Environments.nodeEnv === 'qa' || Environments.nodeEnv === 'development'
    ? [new transports.Console(), loggingWinston]
    : [new transports.Console()];

export default createLogger({
  level: Environments.logLevel,
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.printf((msg: any) => colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}: ${msg.message}`)),
  ),
  transports: loggerTransports,
});
