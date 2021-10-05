import { createLogger, transports, format } from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { Environments } from '../config/environments';

const loggingWinston = new LoggingWinston();

const colorizer = format.colorize();

export default createLogger({
  level: Environments.logLevel,
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.printf((msg: any) => colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}: ${msg.message}`)),
  ),
  transports: [new transports.Console(), loggingWinston],
});
