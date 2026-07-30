# Updating Pipeline Parameters

- Version: 1.0
- Contact: Alexis Lucattini, [alexisl@unimelb.edu.au](mailto:alexisl@unimelb.edu.au)


From time-to-time there may be a requirement to add or subtract pipeline parameters.

The DRAFT payload inputs we supply do not directly map to the pipeline parameters used when running ICAv2.
This assumes that the [CWL pipeline][cwl_pipeline] has already been updated to support the new parameters. See [New Pipeline Deployment SOP][new_pipeline_deployment_sop] for more information.

- [Constants File Update](#constants-file-update)
- [Draft Event Schema](#draft-event-schema)
- [Lambda Parameter Mapping](#lambda-parameter-mapping)
- [Testing](#testing)


## Constants File Update

To update any of our pipeline parameters, head to the [infrastructure constants path][infrastructure_constants_path] and
update the relevant default input parameters for the workflow version.

## Draft Event Schema

If you are adding or removing parameters, you may need to update the [DRAFT event schema][draft_event_schema] to reflect these changes.
This ensures that the input validation for the DRAFT payload is accurate and up-to-date.

## Lambda Parameter Mapping

If you are adding or removing parameters, you will need to update the mapping logic in the ready-to-ICAv2-WES-request Lambda to ensure that the
DRAFT payload inputs are correctly mapped to the ICAv2 pipeline parameters.

## Testing

Deploy your changes to development by updating the pipeline through the ICAv2 Pipeline Update instructions.

As a first pass, you may wish to follow the [Manual Pipeline Execution SOP][manual_pipeline_execution_sop] to ensure
that the changes you have made are functioning as expected.

Once you are happy with the changes, you can trigger a full run through the [Pipeline Verification SOP][verification_testing_sop] to ensure that everything is working as expected.

[cwl_pipeline]: https://github.com/umccr/cwl-ica/releases?q=arriba&expanded=false
[new_pipeline_deployment_sop]: ../PM.AWR.2/PM.AWR.2-NewPipelineDeployment.md
[draft_event_schema]: ../../../../app/event-schemas/complete-data-draft/
[manual_pipeline_execution_sop]: ../PM.AWR.1/PM.AWR.1-ManualPipelineExecution.md
[verification_testing_sop]: ../PM.AWR.4/PM.AWR.4-RunningWorkflowValidations.md
[infrastructure_constants_path]: ../../../../infrastructure/stage/constants.ts
