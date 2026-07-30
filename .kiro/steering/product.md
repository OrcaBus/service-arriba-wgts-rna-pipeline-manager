# Product: Arriba WGTS RNA Pipeline Manager

## Summary

This is an OrcaBus microservice that manages the lifecycle of the **Arriba WGTS RNA pipeline** — a gene fusion detection pipeline using the Arriba tool for identifying fusion transcripts from RNA-seq data, including visualization of structural variants via cytobands and protein domain annotations.

The service handles orchestration on ICAv2 (Illumina Connected Analytics v2) via CWL workflows. It follows the standard ICAv2-centric Pipeline Architecture used across OrcaBus. This is a downstream service — it depends on the successful completion of the Dragen WGTS RNA pipeline (via a glue state machine) to obtain alignment outputs as inputs.

## Core Responsibilities

- Accept `WorkflowRunStateChange` DRAFT events and validate/populate them into READY events
- Submit READY events to ICAv2 as `Icav2WesRequest` events via a Step Functions state machine
- Monitor ICAv2 analysis state changes and convert them to `WorkflowRunUpdate` events
- Validate draft schemas against a registered JSON schema before promotion
- React to upstream Dragen WGTS RNA SUCCEEDED events and update existing DRAFT runs with new alignment data (glue pattern)

## Event Flow

```
DRAFT event (WorkflowRunStateChange)
  → populate draft data (Step Functions)
  → validate draft schema
  → emit READY event
  → submit to ICAv2 WES
  → monitor ICAv2 state changes
  → emit WorkflowRunUpdate events

Upstream SUCCEEDED event (dragen-wgts-rna)
  → glue state machine
  → find matching DRAFT runs
  → merge upstream outputs into DRAFT payload
  → emit WorkflowRunUpdate DRAFT event (if changed)
```

## Upstream / Downstream

- **Upstream**: Dragen WGTS RNA (provides RNA alignment outputs via glue state machine)
- **Downstream**: RNAsum
- **Key dependencies**: ICAv2 WES Manager, Workflow Manager

## Environments

Deploys to `beta`, `gamma`, and `prod` via AWS CodePipeline. The toolchain account hosts the CodePipeline; application stacks deploy cross-account.
