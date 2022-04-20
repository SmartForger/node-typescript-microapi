import { ConfigService } from '@nestjs/config';
import { LoggingWinston } from '@google-cloud/logging-winston';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export function getTransports(configService: ConfigService) {
  const transports: any[] = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('org-lookup-orchestrator', {
          prettyPrint: true,
        }),
      ),
    }),
  ];
  if (configService.get<string>('NODE_ENV') !== 'dev') {
    transports.push(
      new LoggingWinston({
        prefix: 'org-lookup-orchestrator',
        projectId: configService.get<string>('GCP_PROJECT_ID'),
        resource: {
          labels: {
            container_name: 'org-lookup-orchestrator',
            project_id: configService.get<string>('GCP_PROJECT_ID'),
          },
          type: 'k8s_container',
        },
        labels: {
          service: 'org-lookup-orchestrator',
        },
        logName: 'org-lookup-orchestrator_log',
      }),
    );
  }

  return transports;
}
