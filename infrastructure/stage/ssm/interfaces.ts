import { AnnotationVersionType, GenomeVersionType, WorkflowVersionType } from '../interfaces';

export interface SsmParameterValues {
  // Payload defaults
  workflowName: string;
  payloadVersion: string;
  workflowVersion: string;

  // Engine Parameter defaults
  pipelineIdsByWorkflowVersionMap: Record<WorkflowVersionType, string>;
  icav2ProjectId: string;
  logsPrefix: string;
  outputPrefix: string;

  // Reference defaults
  annotationVersionByWorkflowVersionMap: Record<WorkflowVersionType, AnnotationVersionType>;
  annotationPathsByAnnotationVersionMap: Record<AnnotationVersionType, string>;
  cytobandsPathsByWorkflowVersionMap: Record<WorkflowVersionType, string>;
  proteinDomainPathsByWorkflowVersionMap: Record<WorkflowVersionType, string>;
  blacklistPathsByWorkflowVersionMap: Record<WorkflowVersionType, string>;
  referenceVersionByWorkflowVersionMap: Record<WorkflowVersionType, GenomeVersionType>;
  referenceFastaPathsByReferenceFastaVersionMap: Record<GenomeVersionType, string>;
}

export interface SsmParameterPaths {
  // Top level prefix
  ssmRootPrefix: string;

  // Payload defaults
  workflowName: string;
  payloadVersion: string;
  workflowVersion: string;

  // Engine Parameter defaults
  prefixPipelineIdsByWorkflowVersion: string;
  icav2ProjectId: string;
  logsPrefix: string;
  outputPrefix: string;

  // Reference defaults
  annotationVersionByWorkflowSsmRootPrefix: string;
  annotationPathsByAnnotationSsmRootPrefix: string;
  cytobandsPathsByWorkflowSsmRootPrefix: string;
  proteinDomainPathsByWorkflowSsmRootPrefix: string;
  blacklistPathsByWorkflowSsmRootPrefix: string;
  referenceVersionByWorkflowSsmRootPrefix: string;
  referenceFastaPathsByReferenceFastaSsmRootPrefix: string;
}

export interface BuildSsmParameterProps {
  ssmParameterValues: SsmParameterValues;
  ssmParameterPaths: SsmParameterPaths;
}
