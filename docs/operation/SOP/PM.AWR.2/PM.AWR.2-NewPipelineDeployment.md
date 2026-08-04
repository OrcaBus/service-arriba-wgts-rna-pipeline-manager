# New Arriba WGTS RNA Pipeline Deployment

- Version: 1.0
- Contact: Alexis Lucattini, [alexisl@unimelb.edu.au](mailto:alexisl@unimelb.edu.au)

There may be times where we need to create a new CWL workflow for our Arriba WGTS RNA pipeline.

In the SOP below we discuss the following scenarios:

- User wants to tinker with some parameters in the current CWL workflow for testing purposes only.
- User wants to add a new feature to the pipeline that requires a modification to the current CWL workflow.
- User wants to make a new release of the edited CWL workflow for production use.

Throughout the SOP we make the following expectations:

- User is familiar with UMCCR's [cwl-ica repository][cwl_ica_repo] and has a working knowledge of CWL.
- User has access to the ICAv2 platform with at minimum 'Contributor level' permissions in at least one project.
- User has access to the appropriate AWS Account tied to the ICAv2 project.

* [Pipeline Summary](#pipeline-summary)
* [Setup](#setup)
  - [Installing CWL-ICA-CLI](#installing-cwl-ica-cli)
  - [Installing ICAv2 CLI and ICAv2 CLI Plugins](#installing-icav2-cli-and-icav2-cli-plugins)
* [Development Deployment](#development-deployment)
  - [CWL ZIP](#cwl-zip)
  - [Pipeline Creation](#pipeline-creation)
  - [Running the Pipeline](#running-the-pipeline)
  - [Pipeline Update](#pipeline-update)
* [Production Deployment](#production-deployment)
  - [GitHub Releases](#github-releases)
  - [Infrastructure Constants Updates](#infrastructure-constants-updates)
  - [Workflow Manager Updates](#workflow-manager-updates)

## Pipeline Summary

The pipeline runs on [ICA][ica_about], using [CWL][cwl_user_guide] (Common Workflow Language) as the workflow orchestration language
to drive the pipeline. The CWL Workflow for Arriba WGTS RNA is located in our [cwl-ica][cwl_ica_repo] repository
and follows a 'release-based' auto-deployment into ICA for production use.

The Arriba WGTS RNA pipeline performs gene fusion detection from RNA-Seq data using the Arriba tool,
including visualization of structural variants via cytobands and protein domain annotations.

## Setup

### Installing CWL-ICA-CLI

Follow the instructions in the [cwl-ica-wiki][cwl_ica_installation_link].

### Installing ICAv2 CLI and ICAv2 CLI Plugins

Download and install the latest version of the ICAv2 CLI from the [ICAv2 CLI Releases page][icav2_releases_page].

Then also install the ICAv2 CLI Plugins from the [ICAv2 CLI Plugins installation page][icav2_plugins_installation_page].

## Development Deployment

For deployment into the development environment, we follow the philosophy of "this probably isn't going to work the first time",
and as such we want to be able to tinker with any workflow we create on the ICAv2 platform without having to create a new release every time.

ICAv2 supports pipelines in 'DRAFT' mode which can be edited at any time.

### CWL ZIP

The CWL workflow needs to be packaged into a ZIP file for deployment into ICA.

```shell
cwl-ica icav2-zip-workflow \
  --workflow-path workflows/arriba-wgts-rna-pipeline/<version>/arriba-wgts-rna-pipeline__<version>.cwl \
  --force
```

### Pipeline Creation

Once we have the ZIP file, deploy it into ICAv2:

```shell
icav2 projects enter development

icav2 projectpipelines create-cwl-pipeline-from-zip \
  arriba-wgts-rna-pipeline__<version>.zip
```

Keep note of the pipeline ID outputted from the command above.

### Running the Pipeline

Once the pipeline is created, run it on a test dataset. See [SOP 1][sop_1_rel_path] for instructions.

Note you will need to manually add the pipeline ID into the payload:

```json5
{
  payload: {
    version: '<DEFAULT_PAYLOAD_VERSION>',
    data: {
      engineParameters: {
        pipelineId: '<THE PIPELINE ID YOU JUST CREATED>',
      },
    },
  },
}
```

### Pipeline Update

If the pipeline did not work, fix the CWL code, re-zip, and update:

```shell
icav2 projectpipelines update arriba-wgts-rna-pipeline__<version>.zip <pipeline_id>
```

## Production Deployment

### GitHub Releases

Push your CWL code to a branch, have it reviewed and merged, then create a release:

```shell
cwl-ica workflow-release \
  --workflow-path workflows/arriba-wgts-rna-pipeline/<version>/arriba-wgts-rna-pipeline__<version>.cwl
```

### Infrastructure Constants Updates

Update `WORKFLOW_VERSION_TO_DEFAULT_ICAV2_PIPELINE_ID_MAP` in [infrastructure/stage/constants.ts][infrastructure_constants_rel_path] with the new pipeline ID.

### Workflow Manager Updates

Register the new workflow version:

```shell
make-new-workflow.sh \
  --workflow-name 'arriba-wgts-rna' \
  --workflow-version "<version>" \
  --executionEngine "ICA" \
  --executionEnginePipelineId "<pipeline_id>" \
  --codeVersion "$(cd <cwl-ica-repo> && git rev-parse --short=7 HEAD)" \
  --validationState "VALIDATED"
```

[ica_about]: https://www.illumina.com/products/by-type/informatics-products/connected-analytics.html
[cwl_user_guide]: https://www.commonwl.org/user_guide/
[cwl_ica_repo]: https://github.com/umccr/cwl-ica
[cwl_ica_installation_link]: https://github.com/umccr/cwl-ica/wiki/Getting_Started#installation
[icav2_releases_page]: https://help.ica.illumina.com/command-line-interface/cli-installation
[icav2_plugins_installation_page]: https://github.com/umccr/icav2-cli-plugins/wiki#installation
[sop_1_rel_path]: ../PM.AWR.1/PM.AWR.1-ManualPipelineExecution.md
[infrastructure_constants_rel_path]: ../../../../infrastructure/stage/constants.ts
