/* Imports */
import path from 'path';
import { StageName } from '@orcabus/platform-cdk-constructs/shared-config/accounts';
import { AnnotationVersionType, GenomeVersionType, WorkflowVersionType } from './interfaces';
import { DATA_SCHEMA_REGISTRY_NAME } from '@orcabus/platform-cdk-constructs/shared-config/event-bridge';

/* Directory constants */
export const APP_ROOT = path.join(__dirname, '../../app');
export const LAMBDA_DIR = path.join(APP_ROOT, 'lambdas');
export const STEP_FUNCTIONS_DIR = path.join(APP_ROOT, 'step-functions-templates');
export const EVENT_SCHEMAS_DIR = path.join(APP_ROOT, 'event-schemas');

/* Workflow constants */
export const WORKFLOW_NAME = 'arriba-wgts-rna';

// Yet to implement draft events into this service
export const DEFAULT_WORKFLOW_VERSION: WorkflowVersionType = '2.5.0';
export const DEFAULT_PAYLOAD_VERSION = '2025.08.05';

// Default logs and output prefixes
export const WORKFLOW_LOGS_PREFIX = `s3://{__CACHE_BUCKET__}/{__CACHE_PREFIX__}logs/${WORKFLOW_NAME}/`;
export const WORKFLOW_OUTPUT_PREFIX = `s3://{__CACHE_BUCKET__}/{__CACHE_PREFIX__}analysis/${WORKFLOW_NAME}/`;

/* We extend this every time we release a new version of the workflow */
/* This is added into our SSM Parameter Store to allow us to map workflow versions to pipeline IDs */
export const WORKFLOW_VERSION_TO_DEFAULT_ICAV2_PIPELINE_ID_MAP: Record<
  WorkflowVersionType,
  string
> = {
  // At the moment we are running manual deployments of the workflow
  '2.5.0': '635bbcaa-9a23-47e5-8809-dd1ffb4d5831',
};

export const ANNOTATION_VERSION_TO_ANNOTATION_PATHS_MAP: Record<AnnotationVersionType, string> = {
  '44': 's3://reference-data-503977275616-ap-southeast-2/refdata/gencode/hg38/v44/gencode.v44.annotation.gtf.gz',
};

export const WORKFLOW_VERSION_TO_DEFAULT_ANNOTATION_VERSION_MAP: Record<
  WorkflowVersionType,
  AnnotationVersionType
> = {
  '2.5.0': '44',
};

export const CYTOBANDS_VERSION_TO_CYTOBANDS_PATHS_MAP: Record<WorkflowVersionType, string> = {
  '2.5.0':
    's3://reference-data-503977275616-ap-southeast-2/refdata/arriba/2-5-0/cytobands_hg38_GRCh38_v2.5.0.tsv',
};

export const PROTEIN_DOMAINS_VERSION_TO_PROTEIN_DOMAINS_PATHS_MAP: Record<
  WorkflowVersionType,
  string
> = {
  '2.5.0':
    's3://reference-data-503977275616-ap-southeast-2/refdata/arriba/2-5-0/protein_domains_hg38_GRCh38_v2.5.0.gff3',
};

export const BLACKLIST_VERSION_TO_BLACKLIST_PATHS_MAP: Record<WorkflowVersionType, string> = {
  '2.5.0':
    's3://reference-data-503977275616-ap-southeast-2/refdata/arriba/2-5-0/blacklist_hg38_GRCh38_v2.5.0.tsv.gz',
};

export const REFERENCE_GENOME_VERSION_TO_REFERENCE_GENOME_PATHS_MAP: Record<
  GenomeVersionType,
  string
> = {
  hg38: 's3://reference-data-503977275616-ap-southeast-2/refdata/genomes/GRCh38_umccr/GRCh38_full_analysis_set_plus_decoy_hla.fa',
};

export const WORKFLOW_VERSION_TO_DEFAULT_REFERENCE_GENOME_VERSION_MAP: Record<
  WorkflowVersionType,
  GenomeVersionType
> = {
  '2.5.0': 'hg38',
};

/* SSM Parameter Paths */
export const SSM_PARAMETER_PATH_PREFIX = path.join(`/orcabus/workflows/${WORKFLOW_NAME}/`);

// Workflow Parameters
export const SSM_PARAMETER_PATH_WORKFLOW_NAME = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'workflow-name'
);
export const SSM_PARAMETER_PATH_DEFAULT_WORKFLOW_VERSION = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'default-workflow-version'
);

// Engine Parameters
export const SSM_PARAMETER_PATH_PREFIX_PIPELINE_IDS_BY_WORKFLOW_VERSION = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'pipeline-ids-by-workflow-version'
);
export const SSM_PARAMETER_PATH_ICAV2_PROJECT_ID = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'icav2-project-id'
);
export const SSM_PARAMETER_PATH_PAYLOAD_VERSION = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'payload-version'
);
export const SSM_PARAMETER_PATH_LOGS_PREFIX = path.join(SSM_PARAMETER_PATH_PREFIX, 'logs-prefix');
export const SSM_PARAMETER_PATH_OUTPUT_PREFIX = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'output-prefix'
);

// Reference Parameters
export const SSM_PARAMETER_PATH_PREFIX_ANNOTATION_PATH_BY_ANNOTATION_VERSION = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'default-annotation-paths-by-annotation-version'
);
export const SSM_PARAMETER_PATH_PREFIX_ANNOTATION_VERSIONS_BY_WORKFLOW_VERSION = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'default-annotation-versions-by-workflow-version'
);
export const SSM_PARAMETER_PATH_PREFIX_CYTOBANDS_PATHS_BY_WORKFLOW_VERSION = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'default-cytobands-paths-by-workflow-version'
);
export const SSM_PARAMETER_PATH_PREFIX_PROTEIN_DOMAINS_PATHS_BY_WORKFLOW_VERSION = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'default-protein-domain-paths-by-workflow-version'
);
export const SSM_PARAMETER_PATH_PREFIX_BLACKLIST_PATHS_BY_WORKFLOW_VERSION = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'default-blacklist-paths-by-workflow-version'
);
export const SSM_PARAMETER_PATH_PREFIX_REFERENCE_PATH_BY_REFERENCE_VERSION = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'default-reference-fasta-paths-by-reference-fasta-version'
);
export const SSM_PARAMETER_PATH_PREFIX_REFERENCE_VERSIONS_BY_REFERENCE_VERSION = path.join(
  SSM_PARAMETER_PATH_PREFIX,
  'default-reference-fasta-versions-by-workflow-version'
);

/* Event rule constants */
// Yet to implement draft events into this service
export const DRAFT_STATUS = 'DRAFT';
export const READY_STATUS = 'READY';
export const SUCCEEDED_STATUS = 'SUCCEEDED';
export const DRAGEN_WGTS_DNA_WORKFLOW_NAME = 'dragen-wgts-rna';

/* Event Constants */
export const EVENT_BUS_NAME = 'OrcaBusMain';
export const EVENT_SOURCE = 'orcabus.arribawgtsrna';
export const WORKFLOW_RUN_STATE_CHANGE_DETAIL_TYPE = 'WorkflowRunStateChange';
export const WORKFLOW_RUN_UPDATE_DETAIL_TYPE = 'WorkflowRunUpdate';
export const ICAV2_WES_REQUEST_DETAIL_TYPE = 'Icav2WesRequest';
export const ICAV2_WES_STATE_CHANGE_DETAIL_TYPE = 'Icav2WesAnalysisStateChange';

export const WORKFLOW_MANAGER_EVENT_SOURCE = 'orcabus.workflowmanager';
export const ICAV2_WES_EVENT_SOURCE = 'orcabus.icav2wesmanager';

/* Schema constants */
// Yet to implement draft events into this service
export const SCHEMA_REGISTRY_NAME = DATA_SCHEMA_REGISTRY_NAME;
export const SSM_SCHEMA_ROOT = path.join(SSM_PARAMETER_PATH_PREFIX, 'schemas');

/* Future proofing */
export const NEW_WORKFLOW_MANAGER_IS_DEPLOYED: Record<StageName, boolean> = {
  BETA: true,
  GAMMA: false,
  PROD: false,
};

// Used to group event rules and step functions
export const STACK_PREFIX = 'orca-arriba-wgts-rna';
