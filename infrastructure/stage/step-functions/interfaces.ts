import { IEventBus } from 'aws-cdk-lib/aws-events';
import { StateMachine } from 'aws-cdk-lib/aws-stepfunctions';

import { LambdaName, LambdaObject } from '../lambda/interfaces';
import { SsmParameterPaths } from '../ssm/interfaces';

/**
 * Step Function Interfaces
 */
export type StateMachineName =
  // Glue code
  | 'glueSucceededEventsToDraftUpdate'
  // Draft populator
  | 'populateDraftData'
  // Validate draft data and put ready event
  | 'validateDraftDataAndPutReadyEvent'
  // Ready-to-Submitted
  | 'readyEventToIcav2WesRequestEvent'
  // Post-submission event conversion
  | 'icav2WesEventToWrscEvent';

export const stateMachineNameList: StateMachineName[] = [
  // Glue code
  'glueSucceededEventsToDraftUpdate',
  // Draft populator
  'populateDraftData',
  // Validate draft data and put ready event
  'validateDraftDataAndPutReadyEvent',
  // Ready-to-Submitted
  'readyEventToIcav2WesRequestEvent',
  // Post-submission event conversion
  'icav2WesEventToWrscEvent',
];

// Requirements interface for Step Functions
export interface StepFunctionRequirements {
  // Event stuff
  needsEventPutPermission?: boolean;
  // SSM Stuff
  needsSsmParameterStoreAccess?: boolean;
}

export interface StepFunctionInput {
  stateMachineName: StateMachineName;
}

export interface BuildStepFunctionProps extends StepFunctionInput {
  lambdaObjects: LambdaObject[];
  eventBus: IEventBus;
  ssmParameterPaths: SsmParameterPaths;
}

export interface StepFunctionObject extends StepFunctionInput {
  sfnObject: StateMachine;
}

export type WireUpPermissionsProps = BuildStepFunctionProps & StepFunctionObject;

export type BuildStepFunctionsProps = Omit<BuildStepFunctionProps, 'stateMachineName'>;

export const stepFunctionsRequirementsMap: Record<StateMachineName, StepFunctionRequirements> = {
  // Glue code
  glueSucceededEventsToDraftUpdate: {
    needsEventPutPermission: true,
  },
  // Draft populator
  populateDraftData: {
    needsEventPutPermission: true,
    needsSsmParameterStoreAccess: true,
  },
  // Validate draft data and put ready event
  validateDraftDataAndPutReadyEvent: {
    needsEventPutPermission: true,
  },
  // Ready-to-Submitted
  readyEventToIcav2WesRequestEvent: {
    needsEventPutPermission: true,
  },
  // Post-submission event conversion
  icav2WesEventToWrscEvent: {
    needsEventPutPermission: true,
  },
};

export const stepFunctionToLambdasMap: Record<StateMachineName, LambdaName[]> = {
  glueSucceededEventsToDraftUpdate: [
    // Shared pre-ready lambdas
    'getDragenRnaOutputsFromPortalRunId',
    'generateWruEventObjectWithMergedData',
    'comparePayload',
    'getWorkflowRunObject',
    'findLatestWorkflow',
    'getDraftPayload',
  ],
  populateDraftData: [
    // Shared pre-ready lambdas
    'getDragenRnaOutputsFromPortalRunId',
    'generateWruEventObjectWithMergedData',
    'comparePayload',
    'getMissingSchemaFields',
    'getWorkflowRunObject',
    'findLatestWorkflow',
    'getDraftPayload',
    // Draft to ready
    'getLibraries',
    'getFastqRgidsFromLibraryId',
    'getMetadataTags',
    'getFastqIdListFromRgidList',
    // Validation
    'validateDraftDataCompleteSchema',
    // Commentary
    'addPopulateDraftComment',
  ],
  validateDraftDataAndPutReadyEvent: [
    // Validation
    'validateDraftDataCompleteSchema',
    'postSchemaValidation',
  ],
  readyEventToIcav2WesRequestEvent: [
    // Commentary
    'addReadyComment',
    // Ready to ICAv2 WES lambdas
    'convertReadyEventInputsToIcav2WesEventInputs',
  ],
  icav2WesEventToWrscEvent: [
    // ICAv2 WES to WRSC Event lambdas
    'convertIcav2WesEventToWrscEvent',
    'addWesFailureComment',
  ],
};
