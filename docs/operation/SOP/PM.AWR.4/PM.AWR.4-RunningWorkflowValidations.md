# Running Workflow Validations

- Version: 1.0
- Contact: Alexis Lucattini, [alexisl@unimelb.edu.au](mailto:alexisl@unimelb.edu.au)


Before promoting a new pipeline version to production, we need to validate that the pipeline runs correctly
against a known set of test inputs and produces expected results.

- [Prerequisites](#prerequisites)
- [Validation Procedure](#validation-procedure)
  - [1. Identify Test Datasets](#1-identify-test-datasets)
  - [2. Submit Test Runs](#2-submit-test-runs)
  - [3. Monitor Execution](#3-monitor-execution)
  - [4. Validate Outputs](#4-validate-outputs)
- [Sign-off](#sign-off)


## Prerequisites

- New pipeline version deployed in the `beta` environment (see [PM.AWR.2][new_pipeline_deployment_sop])
- Access to the OrcaBus Portal and AWS Console
- Known test library IDs for RNA fusion detection validation

## Validation Procedure

### 1. Identify Test Datasets

Select at least one RNA library with known fusion events that can be used to validate
the Arriba fusion detection pipeline. Ideally use libraries from previous validated runs
to enable result comparison.

### 2. Submit Test Runs

Follow the [Manual Pipeline Execution SOP][manual_pipeline_execution_sop] to submit DRAFT events
for each test library. Ensure the `workflowVersion` matches the version being validated and
set the `pipelineId` to the new pipeline deployment.

### 3. Monitor Execution

Monitor the workflow runs via the [OrcaBus Portal](https://portal.umccr.org/runs/workflow):

- Confirm the run transitions from DRAFT → READY → RUNNING → SUCCEEDED
- Check Step Functions executions for any errors
- Review the ICAv2 analysis logs for any warnings

### 4. Validate Outputs

Once the run has SUCCEEDED:

- Verify fusion detection outputs are present in the output directory
- Compare fusion calls against known/expected fusions for the test library
- Confirm output file formats and structure match expectations
- Review the Arriba visualization outputs (SVG/PDF) if applicable

## Sign-off

Once all test runs complete successfully and outputs are validated:

1. Document the validation results
2. Update the workflow version constants for production deployment
3. Create a PR with the version update and reference the validation results

[new_pipeline_deployment_sop]: ../PM.AWR.2/PM.AWR.2-NewPipelineDeployment.md
[manual_pipeline_execution_sop]: ../PM.AWR.1/PM.AWR.1-ManualPipelineExecution.md
