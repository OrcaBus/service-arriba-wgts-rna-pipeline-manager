# Trouble Shooting

- Version: 1.0
- Contact: Alexis Lucattini, [alexisl@unimelb.edu.au](mailto:alexisl@unimelb.edu.au)

Most processes within the Arriba WGTS RNA Orchestration use AWS Step Functions to manage the workflow.
We post all Step Function errors to the #alerts-prod slack channel, a Center staff member can
then click on the offending Step Function link in the slack message to be taken to the AWS Step Functions console to investigate further.

- [Analysis Stuck in DRAFT state](#analysis-stuck-in-draft-state)
  - [Waiting for Upstream Dragen WGTS RNA](#waiting-for-upstream-dragen-wgts-rna)
  - [Payload Mismatch](#payload-mismatch)
- [Analysis Stuck in READY state](#analysis-stuck-in-ready-state)
- [Analysis Fails to Start](#analysis-fails-to-start)
  - [Project Not Set Up Correctly](#project-not-set-up-correctly)
  - [Invalid Pipeline ID](#invalid-pipeline-id)
  - [Data Not Available](#data-not-available)
- [Common Arriba Failures](#common-arriba-failures)
  - [Missing Alignment Data](#missing-alignment-data)

## Analysis Stuck in DRAFT state

If the analysis is stuck in DRAFT mode, there may be a couple of reasons for this.
To determine which issue is causing the problem, head to the [AWS Step Functions Console][aws_step_functions_console_prod]
in the production account and look for any RUNNING executions in the `orca-arriba-wgts-rna--populateDraftData` step function.

### Waiting for Upstream Dragen WGTS RNA

As a downstream service, Arriba depends on the upstream Dragen WGTS RNA pipeline to provide alignment outputs.
If the upstream pipeline has not yet completed:

- Check the status of the corresponding Dragen WGTS RNA workflow run in the [OrcaBus Portal](https://portal.umccr.org/runs/workflow)
- The glue state machine will automatically update the DRAFT run when the upstream pipeline succeeds
- If the upstream pipeline has failed, you may need to resubmit the upstream run first

### Payload Mismatch

If you can find the most recent step function execution for this library ID, look at the Log Group for the `validate_draft_complete_schema` Lambda.

This Lambda will let you know how the payload violates the expected schema.
You may wish to then manually update the payload and generate a new WorkflowRunUpdate draft event as discussed in [SOP 1][sop_1_rel_path].

## Analysis Stuck in READY state

If the analysis is stuck in READY state, then it is likely that the translation from the READY event to the ICAv2 WES event has failed.
This is a rare occurrence, but may be due to transient issues with the ICAv2 WES manager.
One can confirm that this has occurred by querying the offending workflow run name against the [ICAv2 WES Manager API][icav2_wes_api_swagger_page].

## Analysis Fails to Start

The ICAv2 WES manager may fail to create an analysis for any of the following reasons:

### Project Not Set Up Correctly

Common things to confirm:

- Ensure that the ICAv2 Production Service User has been added to the project with the correct permissions.
- Ensure that the Notifications Channels have been set up correctly for the project.

### Invalid Pipeline ID

> The pipeline id specified is not available in the project id

This can be mitigated with:

```
icav2 projects enter <project_id>
icav2 projectpipeline link <pipeline_id>
```

You will need to create a new workflow run after this change.

### Data Not Available

> Data .x. is not available in the project id <project_id>

If the upstream Dragen WGTS RNA alignment data cannot be found in the ICAv2 project,
you may need to ensure the data is linked or accessible. Check that:

- The upstream Dragen WGTS RNA run completed successfully
- The alignment outputs are available at the expected S3 URI
- The data is accessible within the ICAv2 project context

## Common Arriba Failures

### Missing Alignment Data

If Arriba fails because alignment data is missing, this typically means the upstream
Dragen WGTS RNA pipeline has not yet completed or its outputs are not accessible.

Check:

- The upstream Dragen WGTS RNA workflow run status
- The glue state machine execution to ensure alignment data was correctly propagated
- The input URIs in the DRAFT payload point to valid alignment files

[aws_step_functions_console_prod]: https://472057503814.ap-southeast-2.console.aws.amazon.com/states/home?region=ap-southeast-2#/statemachines
[sop_1_rel_path]: ../PM.AWR.1/PM.AWR.1-ManualPipelineExecution.md
[icav2_wes_api_swagger_page]: https://icav2-wes.prod.umccr.org/schema/swagger-ui#/
