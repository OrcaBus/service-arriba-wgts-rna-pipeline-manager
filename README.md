# Arriba WGTS RNA Pipeline Manager

## Table of Contents <!-- omit in toc -->

- [Description](#description)
  - [Ready Event Creation](#ready-event-creation)
  - [Consumed Events](#consumed-events)
  - [Published Events](#published-events)
  - [Draft Event](#draft-event)
    - [Draft Event Submission](#draft-event-submission)
    - [Draft Data Schema Validation](#draft-data-schema-validation)
  - [Release management](#release-management)
  - [Related Services](#related-services)
    - [Upstream Pipelines](#upstream-pipelines)
    - [Downstream Pipelines](#downstream-pipelines)
    - [Primary Services](#primary-services)
- [Infrastructure \& Deployment](#infrastructure--deployment)
  - [Stateful](#stateful)
  - [Stateless](#stateless)
  - [CDK Commands](#cdk-commands)
  - [Stacks](#stacks)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Setup](#setup)
    - [Requirements](#requirements)
    - [Install Dependencies](#install-dependencies)
  - [Conventions](#conventions)
  - [Linting \& Formatting](#linting--formatting)
  - [Testing](#testing)
- [Glossary \& References](#glossary--references)

## Description

This is the Arriba WGTS RNA Pipeline Manager service, responsible for managing and orchestrating the
Arriba WGTS RNA sequencing workflows within the OrcaBus platform.

The [arriba package](https://github.com/suhrig/arriba) is used for gene fusion detection from RNA-Seq data.

The orchestration logic is per the standard [ICAv2-centric Pipeline Architecture](https://github.com/OrcaBus/wiki/blob/main/orcabus/platform/pipelines.md#pipeline-orchestration-general-logic)

### Ready Event Creation

![Arriba WGTS RNA Pipeline Manager Architecture](./docs/draw-io-exports/draft-to-ready.drawio.svg)

### Consumed Events

| Name / DetailType             | Source                    | Schema Link                                                                                                                                | Description                           |
|-------------------------------|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------|
| `WorkflowRunStateChange`      | `orcabus.workflowmanager` | [WorkflowRunStateChange](https://github.com/OrcaBus/wiki/tree/main/orcabus-platform#workflowrunstatechange)                                | Source of updates on WorkflowRuns     |
| `Icav2WesAnalysisStateChange` | `orcabus.icav2wes`        | [Icav2WesAnalysisStateChange](https://github.com/OrcaBus/service-icav2-wes-manager/blob/main/app/event-schemas/analysis-state-change.json) | ICAv2 WES Analysis State Change event |

### Published Events

| Name / DetailType   | Source                  | Schema Link                                                                                                                                    | Description                    |
|---------------------|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------|
| `WorkflowRunUpdate` | `orcabus.arribawgtsrna` | [WorkflowRunUpdate](https://github.com/OrcaBus/service-workflow-manager/blob/main/docs/events/WorkflowRunUpdate/WorkflowRunUpdate.schema.json) | Announces Workflow Run Updates |

### Draft Event

A workflow run must be placed into a DRAFT state before it can be started.

This is to ensure that only valid workflow runs are started, and that all required data is present.

This service is responsible for both populating and validating draft workflow runs.

A draft event may even be submitted without a payload.

#### Draft Event Submission

To submit an Arriba WGTS RNA draft event, please follow the [PM.AWR.1 SOP](docs/operation/SOP/README.md#PM.AWR.1)
in our SOPs documentation.

#### Draft Data Schema Validation

We have generated JSON schemas for the complete DRAFT WRU event **data** which you can find in the
[`app/event-schemas` directory](app/event-schemas).

You can interactively check if your DRAFT event data payload matches the schema using the following links:

- [Complete DRAFT WRU Event Data Schema Page](https://www.jsonschemavalidator.net/s/8tRREgRp)

### Release management

The service employs a fully automated CI/CD pipeline that
automatically builds and releases all changes to the `main` code branch.

### Related Services

#### Upstream Pipelines

- [Dragen WGTS RNA Pipeline Manager](https://github.com/OrcaBus/service-dragen-wgts-rna-pipeline-manager)

#### Downstream Pipelines

- [RNASum Pipeline Manager](https://github.com/OrcaBus/service-rnasum-pipeline-manager)

#### Primary Services

- [ICAv2 WES Manager](https://github.com/OrcaBus/service-icav2-wes-manager)
- [Workflow Manager](https://github.com/OrcaBus/service-workflow-manager)

## Infrastructure & Deployment

Short description with diagrams where appropriate.
Deployment settings / configuration (e.g. CodePipeline(s) / automated builds).
Infrastructure and deployment are managed via CDK.
This template provides two types of CDK entry points: `cdk-stateless` and `cdk-stateful`.

### Stateful

- SSM Parameters
- Event Schemas

### Stateless

- Lambdas
- Step Functions
- Event Rules
- Event Targets (connecting event rules to StepFunctions)

### CDK Commands

You can access CDK commands using the `pnpm` wrapper script.

- **`cdk-stateless`**: Used to deploy stacks containing stateless resources (e.g., AWS Lambda), which can be easily
  redeployed without side effects.
- **`cdk-stateful`**: Used to deploy stacks containing stateful resources (e.g., AWS DynamoDB, AWS RDS), where
  redeployment may not be ideal due to potential side effects.

The type of stack to deploy is determined by the context set in the `./bin/deploy.ts` file. This ensures the correct
stack is executed based on the provided context.

For example:

```sh
# Deploy a stateless stack
pnpm cdk-stateless <command>

# Deploy a stateful stack
pnpm cdk-stateful <command>
```

### Stacks

This CDK project manages multiple stacks. The root stack (the only one that does not include `DeploymentPipeline` in its
stack ID) is deployed in the toolchain account and sets up a CodePipeline for cross-environment deployments to `beta`,
`gamma`, and `prod`.

To list all available stacks, run:

```sh
pnpm cdk-stateful ls
pnpm cdk-stateless ls
```

Output

```sh
# Stateful
StatefulArribaWgtsRnaPipeline
StatefulArribaWgtsRnaPipeline/StatefulArribaWgtsRnaPipeline/OrcaBusBeta/StatefulArribaWgtsRnaPipeline (OrcaBusBeta-StatefulArribaWgtsRnaPipeline)
StatefulArribaWgtsRnaPipeline/StatefulArribaWgtsRnaPipeline/OrcaBusGamma/StatefulArribaWgtsRnaPipeline (OrcaBusGamma-StatefulArribaWgtsRnaPipeline)
StatefulArribaWgtsRnaPipeline/StatefulArribaWgtsRnaPipeline/OrcaBusProd/StatefulArribaWgtsRnaPipeline (OrcaBusProd-StatefulArribaWgtsRnaPipeline)
# Stateless
StatelessArribaWgtsRnaPipelineManager
StatelessArribaWgtsRnaPipelineManager/StatelessArribaWgtsRnaPipeline/OrcaBusBeta/StatelessArribaWgtsRnaPipelineManager (OrcaBusBeta-StatelessArribaWgtsRnaPipelineManager)
StatelessArribaWgtsRnaPipelineManager/StatelessArribaWgtsRnaPipeline/OrcaBusGamma/StatelessArribaWgtsRnaPipelineManager (OrcaBusGamma-StatelessArribaWgtsRnaPipelineManager)
StatelessArribaWgtsRnaPipelineManager/StatelessArribaWgtsRnaPipeline/OrcaBusProd/StatelessArribaWgtsRnaPipelineManager (OrcaBusProd-StatelessArribaWgtsRnaPipelineManager)
```

## Development

### Project Structure

The root of the project is an AWS CDK project where the main application logic lives inside the `./app` folder.

The project is organized into the following key directories:

- **`./app`**:
  - Contains the main application logic (lambdas / step functions / event schemas).

- **`./bin/deploy.ts`**:
  - Serves as the entry point of the application.
  - It initializes two root stacks: `stateless` and `stateful`.

- **`./infrastructure`**: Contains the infrastructure code for the project:
    - **`./infrastructure/toolchain`**: Includes stacks for the stateless and stateful resources deployed in the toolchain account.
      - These stacks primarily set up the CodePipeline for cross-environment deployments.
    - **`./infrastructure/stage`**: Defines the stage stacks for different environments:
        - **`./infrastructure/stage/interfaces`**: The TypeScript interfaces used across constants, and stack configurations.
        - **`./infrastructure/stage/constants.ts`**: Constants used across different stacks and stages.
        - **`./infrastructure/stage/config.ts`**: Contains environment-specific configuration files (e.g., `beta`,
          `gamma`, `prod`).
        - **`./infrastructure/stage/stateful-application-stack.ts`**: The CDK stack entry point for provisioning resources required by the
          application in `./app`.
        - **`./infrastructure/stage/stateless-application-stack.ts`**: The CDK stack entry point for provisioning stateless resources required by the
          application in `./app`.
        - **`./infrastructure/stage/<aws-service-constructs>/`**: Contains AWS service-specific constructs used in the stacks.
          - Each AWS service construct is called from either the `stateful-application-stack.ts` or `stateless-application-stack.ts`.
          - Each AWS service folder contains an `index.ts` and `interfaces.ts` file.

- **`.github/workflows/pr-tests.yml`**: Configures GitHub Actions to run tests for `make check` (linting and code
  style), tests defined in `./test`, and `make test` for the `./app` directory. Modify this file as needed to ensure the
  tests are properly configured for your environment.

- **`./test`**: Contains tests for CDK code compliance against `cdk-nag`. You should modify these test files to match
  the resources defined in the `./infrastructure` folder.

### Setup

#### Requirements

```sh
node --version
v22.9.0

# Update Corepack (if necessary, as per pnpm documentation)
npm install --global corepack@latest

# Enable Corepack to use pnpm
corepack enable pnpm

```

#### Install Dependencies

To install all required dependencies, run:

```sh
make install
```

### Conventions

### Linting & Formatting

Automated checks are enforced via pre-commit hooks, ensuring only checked code is committed. For details consult the
`.pre-commit-config.yaml` file.

Manual, on-demand checking is also available via `make` targets (see below). For details consult the `Makefile` in the
root of the project.

To run linting and formatting checks on the root project, use:

```sh
make check
```

To automatically fix issues with ESLint and Prettier, run:

```sh
make fix
```

### Testing

Unit tests are available for most of the business logic. Test code is hosted alongside business in `/tests/` directories.

```sh
make test
```

## Glossary & References

For general terms and expressions used across OrcaBus services, please see the
platform [documentation](https://github.com/OrcaBus/wiki/blob/main/orcabus-platform/README.md#glossary--references).
