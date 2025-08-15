import { SsmParameterPaths, SsmParameterValues } from './ssm/interfaces';

export type WorkflowVersionType = '2.5.0';

export type AnnotationVersionType = '44';

export type GenomeVersionType = 'hg38';

/**
 * Stateful application stack interface.
 */

export interface StatefulApplicationStackConfig {
  // Values
  // Detail
  ssmParameterValues: SsmParameterValues;

  // Keys
  ssmParameterPaths: SsmParameterPaths;
}

/**
 * Stateless application stack interface.
 */
export interface StatelessApplicationStackConfig {
  // Event Stuff
  eventBusName: string;

  // Workflow manager stuff
  isNewWorkflowManagerDeployed: boolean;
}
