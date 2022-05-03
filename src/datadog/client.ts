import tracer from 'dd-trace';

export const dataDogTracer = () => {
  tracer.init().use('express', {
    headers: ['x-kwri-client-id'],
    service: 'org-lookup-orchestrator',
  });
};
