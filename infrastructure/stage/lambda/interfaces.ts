import { PythonUvFunction } from '@orcabus/platform-cdk-constructs/lambda';

export type LambdaName =
  // Shared pre-ready lambdas
  | 'getDragenRnaOutputsFromPortalRunId'
  | 'generateWruEventObjectWithMergedData'
  | 'comparePayload'
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
  // Ready to ICAv2 WES lambdas
  | 'convertReadyEventInputsToIcav2WesEventInputs'
  // ICAv2 WES to WRSC Event lambdas
  | 'convertIcav2WesEventToWrscEvent';

export const lambdaNameList: LambdaName[] = [
  // Shared pre-ready lambdas
  'getDragenRnaOutputsFromPortalRunId',
  'generateWruEventObjectWithMergedData',
  'comparePayload',
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
  // Ready to ICAv2 WES lambdas
  'convertReadyEventInputsToIcav2WesEventInputs',
  // ICAv2 WES to WRSC Event lambdas
  'convertIcav2WesEventToWrscEvent',
];

// Requirements interface for Lambda functions
export interface LambdaRequirements {
  needsOrcabusApiTools?: boolean;
  needsSsmParametersAccess?: boolean;
  needsSchemaRegistryAccess?: boolean;
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
    needsSchemaRegistryAccess: true,
    needsSsmParametersAccess: true,
  },
  // Convert ready to ICAv2 WES Event - no requirements
  convertReadyEventInputsToIcav2WesEventInputs: {},
  // Needs OrcaBus toolkit to get the wrsc event
  convertIcav2WesEventToWrscEvent: {
    needsOrcabusApiTools: true,
  },
};

export interface LambdaInput {
  lambdaName: LambdaName;
}

export interface LambdaObject extends LambdaInput {
  lambdaFunction: PythonUvFunction;
}
