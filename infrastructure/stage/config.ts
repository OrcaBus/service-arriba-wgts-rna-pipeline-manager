import {
  DEFAULT_PAYLOAD_VERSION,
  SSM_PARAMETER_PATH_ICAV2_PROJECT_ID,
  SSM_PARAMETER_PATH_LOGS_PREFIX,
  SSM_PARAMETER_PATH_OUTPUT_PREFIX,
  SSM_PARAMETER_PATH_PAYLOAD_VERSION,
  SSM_PARAMETER_PATH_PREFIX_PIPELINE_IDS_BY_WORKFLOW_VERSION,
  SSM_PARAMETER_PATH_WORKFLOW_NAME,
  SSM_PARAMETER_PATH_DEFAULT_WORKFLOW_VERSION,
  DEFAULT_WORKFLOW_VERSION,
  WORKFLOW_LOGS_PREFIX,
  WORKFLOW_NAME,
  WORKFLOW_OUTPUT_PREFIX,
  WORKFLOW_VERSION_TO_DEFAULT_ICAV2_PIPELINE_ID_MAP,
  EVENT_BUS_NAME,
  SSM_PARAMETER_PATH_PREFIX,
  NEW_WORKFLOW_MANAGER_IS_DEPLOYED,
  ANNOTATION_VERSION_TO_ANNOTATION_PATHS_MAP,
  REFERENCE_GENOME_VERSION_TO_REFERENCE_GENOME_PATHS_MAP,
  BLACKLIST_VERSION_TO_BLACKLIST_PATHS_MAP,
  CYTOBANDS_VERSION_TO_CYTOBANDS_PATHS_MAP,
  PROTEIN_DOMAINS_VERSION_TO_PROTEIN_DOMAINS_PATHS_MAP,
  WORKFLOW_VERSION_TO_DEFAULT_ANNOTATION_VERSION_MAP,
  WORKFLOW_VERSION_TO_DEFAULT_REFERENCE_GENOME_VERSION_MAP,
  SSM_PARAMETER_PATH_PREFIX_BLACKLIST_PATHS_BY_WORKFLOW_VERSION,
  SSM_PARAMETER_PATH_PREFIX_CYTOBANDS_PATHS_BY_WORKFLOW_VERSION,
  SSM_PARAMETER_PATH_PREFIX_PROTEIN_DOMAINS_PATHS_BY_WORKFLOW_VERSION,
  SSM_PARAMETER_PATH_PREFIX_REFERENCE_PATH_BY_REFERENCE_VERSION,
  SSM_PARAMETER_PATH_PREFIX_REFERENCE_VERSIONS_BY_REFERENCE_VERSION,
  SSM_PARAMETER_PATH_PREFIX_ANNOTATION_PATH_BY_ANNOTATION_VERSION,
  SSM_PARAMETER_PATH_PREFIX_ANNOTATION_VERSIONS_BY_WORKFLOW_VERSION,
} from './constants';
import { StatefulApplicationStackConfig, StatelessApplicationStackConfig } from './interfaces';
import { StageName } from '@orcabus/platform-cdk-constructs/shared-config/accounts';
import { ICAV2_PROJECT_ID } from '@orcabus/platform-cdk-constructs/shared-config/icav2';
import { substituteBucketConstants } from './utils';
import { SsmParameterPaths, SsmParameterValues } from './ssm/interfaces';

/**
 * Stateful stack properties for the workflow.
 * Mainly just linking values from SSM parameters
 * @param stage
 */

export const getSsmParameterValues = (stage: StageName): SsmParameterValues => {
  return {
    // Values
    // Detail
    workflowName: WORKFLOW_NAME,
    workflowVersion: DEFAULT_WORKFLOW_VERSION,

    // Payload
    payloadVersion: DEFAULT_PAYLOAD_VERSION,

    // Engine Parameters
    pipelineIdsByWorkflowVersionMap: WORKFLOW_VERSION_TO_DEFAULT_ICAV2_PIPELINE_ID_MAP,
    icav2ProjectId: ICAV2_PROJECT_ID[stage],
    logsPrefix: substituteBucketConstants(WORKFLOW_LOGS_PREFIX, stage),
    outputPrefix: substituteBucketConstants(WORKFLOW_OUTPUT_PREFIX, stage),

    // References
    referenceVersionByWorkflowVersionMap: WORKFLOW_VERSION_TO_DEFAULT_REFERENCE_GENOME_VERSION_MAP,
    referenceFastaPathsByReferenceFastaVersionMap:
      REFERENCE_GENOME_VERSION_TO_REFERENCE_GENOME_PATHS_MAP,
    annotationVersionByWorkflowVersionMap: WORKFLOW_VERSION_TO_DEFAULT_ANNOTATION_VERSION_MAP,
    annotationPathsByAnnotationVersionMap: ANNOTATION_VERSION_TO_ANNOTATION_PATHS_MAP,
    blacklistPathsByWorkflowVersionMap: BLACKLIST_VERSION_TO_BLACKLIST_PATHS_MAP,
    cytobandsPathsByWorkflowVersionMap: CYTOBANDS_VERSION_TO_CYTOBANDS_PATHS_MAP,
    proteinDomainPathsByWorkflowVersionMap: PROTEIN_DOMAINS_VERSION_TO_PROTEIN_DOMAINS_PATHS_MAP,
  };
};

export const getSsmParameterPaths = (): SsmParameterPaths => {
  return {
    // Top level prefix
    ssmRootPrefix: SSM_PARAMETER_PATH_PREFIX,

    // Detail
    workflowName: SSM_PARAMETER_PATH_WORKFLOW_NAME,
    workflowVersion: SSM_PARAMETER_PATH_DEFAULT_WORKFLOW_VERSION,

    // Payload
    payloadVersion: SSM_PARAMETER_PATH_PAYLOAD_VERSION,

    // Engine Parameters
    prefixPipelineIdsByWorkflowVersion: SSM_PARAMETER_PATH_PREFIX_PIPELINE_IDS_BY_WORKFLOW_VERSION,
    icav2ProjectId: SSM_PARAMETER_PATH_ICAV2_PROJECT_ID,
    logsPrefix: SSM_PARAMETER_PATH_LOGS_PREFIX,
    outputPrefix: SSM_PARAMETER_PATH_OUTPUT_PREFIX,

    // Reference SSM Paths
    annotationVersionByWorkflowSsmRootPrefix:
      SSM_PARAMETER_PATH_PREFIX_ANNOTATION_VERSIONS_BY_WORKFLOW_VERSION,
    annotationPathsByAnnotationSsmRootPrefix:
      SSM_PARAMETER_PATH_PREFIX_ANNOTATION_PATH_BY_ANNOTATION_VERSION,
    blacklistPathsByWorkflowSsmRootPrefix:
      SSM_PARAMETER_PATH_PREFIX_BLACKLIST_PATHS_BY_WORKFLOW_VERSION,
    cytobandsPathsByWorkflowSsmRootPrefix:
      SSM_PARAMETER_PATH_PREFIX_CYTOBANDS_PATHS_BY_WORKFLOW_VERSION,
    proteinDomainPathsByWorkflowSsmRootPrefix:
      SSM_PARAMETER_PATH_PREFIX_PROTEIN_DOMAINS_PATHS_BY_WORKFLOW_VERSION,
    referenceFastaPathsByReferenceFastaSsmRootPrefix:
      SSM_PARAMETER_PATH_PREFIX_REFERENCE_PATH_BY_REFERENCE_VERSION,
    referenceVersionByWorkflowSsmRootPrefix:
      SSM_PARAMETER_PATH_PREFIX_REFERENCE_VERSIONS_BY_REFERENCE_VERSION,
  };
};

export const getStatefulStackProps = (stage: StageName): StatefulApplicationStackConfig => {
  return {
    // SSM Parameter Paths
    ssmParameterPaths: getSsmParameterPaths(),

    // SSM Parameter Values
    ssmParameterValues: getSsmParameterValues(stage),
  };
};

export const getStatelessStackProps = (stage: StageName): StatelessApplicationStackConfig => {
  return {
    // Event Bus Object
    eventBusName: EVENT_BUS_NAME,

    // Is new workflow manager deployed
    isNewWorkflowManagerDeployed: NEW_WORKFLOW_MANAGER_IS_DEPLOYED[stage],

    // SSM Parameter paths
    ssmParameterPaths: getSsmParameterPaths(),
  };
};
