import { PythonUvFunction } from '@orcabus/platform-cdk-constructs/lambda';

export type LambdaName =
  // Shared pre-ready lambdas
  | 'getDragenRnaOutputsFromPortalRunId'
  | 'generateWruEventObjectWithMergedData'
  | 'comparePayload'
  | 'getMissingSchemaFields'
  | 'getWorkflowRunObject'
  | 'findLatestWorkflow'
  | 'getDraftPayload'
  // Glue upstream
  // Draft to ready
  | 'getLibraries'
  | 'getFastqRgidsFromLibraryId'
  | 'getMetadataTags'
  | 'getFastqIdListFromRgidList'
  // Validation
  | 'validateDraftDataCompleteSchema'
  | 'postSchemaValidation'
  // Commentary Functions
  | 'addPopulateDraftComment'
  | 'addReadyComment'
  // Ready to ICAv2 WES lambdas
  | 'convertReadyEventInputsToIcav2WesEventInputs'
  // ICAv2 WES to WRSC Event lambdas
  | 'convertIcav2WesEventToWrscEvent'
  | 'addWesFailureComment';

export const lambdaNameList: LambdaName[] = [
  // Shared pre-ready lambdas
  'getDragenRnaOutputsFromPortalRunId',
  'generateWruEventObjectWithMergedData',
  'comparePayload',
  'getMissingSchemaFields',
  'getWorkflowRunObject',
  'findLatestWorkflow',
  'getDraftPayload',
  // Glue upstream
  // Draft to ready
  'getLibraries',
  'getFastqRgidsFromLibraryId',
  'getMetadataTags',
  'getFastqIdListFromRgidList',
  // Validation
  'validateDraftDataCompleteSchema',
  'postSchemaValidation',
  // Commentary Functions
  'addPopulateDraftComment',
  'addReadyComment',
  // Ready to ICAv2 WES lambdas
  'convertReadyEventInputsToIcav2WesEventInputs',
  // ICAv2 WES to WRSC Event lambdas
  'convertIcav2WesEventToWrscEvent',
  'addWesFailureComment',
];

// Requirements interface for Lambda functions
export interface LambdaRequirements {
  needsOrcabusApiTools?: boolean;
  needsIcav2Tools?: boolean;
  needsHigherMemory?: boolean;
  needsSsmParametersAccess?: boolean;
  needsSchemaRegistryAccess?: boolean;
  needsExternalBucketInfo?: boolean;
  needsWorkflowInfo?: boolean;
  needsRepoUrl?: boolean;
}

// Lambda requirements mapping
export const lambdaRequirementsMap: Record<LambdaName, LambdaRequirements> = {
  // Shared pre-ready lambdas
  getDragenRnaOutputsFromPortalRunId: {
    needsOrcabusApiTools: true,
  },
  generateWruEventObjectWithMergedData: {
    needsOrcabusApiTools: true,
  },
  comparePayload: {},
  getMissingSchemaFields: {
    needsSchemaRegistryAccess: true,
    needsSsmParametersAccess: true,
  },
  getWorkflowRunObject: {
    needsOrcabusApiTools: true,
  },
  findLatestWorkflow: {
    needsOrcabusApiTools: true,
  },
  getDraftPayload: {
    needsOrcabusApiTools: true,
  },
  // Glue upstream
  // Draft to ready
  getLibraries: {
    needsOrcabusApiTools: true,
  },
  getFastqRgidsFromLibraryId: {
    needsOrcabusApiTools: true,
  },
  getMetadataTags: {
    needsOrcabusApiTools: true,
  },
  getFastqIdListFromRgidList: {
    needsOrcabusApiTools: true,
  },
  // Validation
  validateDraftDataCompleteSchema: {
    needsOrcabusApiTools: true,
    needsSchemaRegistryAccess: true,
    needsSsmParametersAccess: true,
    needsWorkflowInfo: true,
  },
  postSchemaValidation: {
    needsOrcabusApiTools: true,
    needsIcav2Tools: true,
    needsExternalBucketInfo: true,
    needsWorkflowInfo: true,
  },
  // Commentary Functions
  addPopulateDraftComment: {
    needsOrcabusApiTools: true,
    needsWorkflowInfo: true,
    needsRepoUrl: true,
  },
  addReadyComment: {
    needsOrcabusApiTools: true,
    needsWorkflowInfo: true,
  },
  // Convert ready to ICAv2 WES Event - no requirements
  convertReadyEventInputsToIcav2WesEventInputs: {},
  // Needs OrcaBus toolkit to get the wrsc event
  convertIcav2WesEventToWrscEvent: {
    needsOrcabusApiTools: true,
  },
  addWesFailureComment: {
    needsOrcabusApiTools: true,
    needsWorkflowInfo: true,
  },
};

export interface LambdaInput {
  lambdaName: LambdaName;
}

export interface LambdaObject extends LambdaInput {
  lambdaFunction: PythonUvFunction;
}
