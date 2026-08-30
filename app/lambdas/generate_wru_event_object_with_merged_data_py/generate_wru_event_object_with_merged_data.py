#!/usr/bin/env python3

"""
Generate a WorkflowRunUpdate event object with merged data.

This Lambda constructs the complete WRU event detail object from the current
draft workflow run and the upstream (dragen-wgts-rna) alignment data.

Input:
{
    "portalRunId": "...",
    "libraries": [...],            # optional
    "payload": {
        "version": "...",
        "data": {
            "inputs": {...},
            "tags": {...},
            "engineParameters": {...}
        }
    },
    "upstreamData": {
        "alignmentData": {...}     # from get_dragen_rna_outputs_from_portal_run_id
    }
}

Output:
{
    "workflowRunUpdate": {
        "orcabusId": "...",
        "portalRunId": "...",
        "status": "DRAFT",
        "workflow": {...},
        "workflowRunName": "...",
        "libraries": [...],
        "payload": {...}
    }
}
"""

# Layer imports
from orcabus_api_tools.workflow import (
    get_workflow_run_from_portal_run_id
)


def handler(event, context):
    """
    Generate WRU event object with merged data for the arriba-wgts-rna pipeline.
    :param event:
    :param context:
    :return:
    """

    # Get the event inputs
    portal_run_id = event.get("portalRunId", None)
    libraries = event.get("libraries", None)
    payload = event.get("payload", None)
    upstream_data = event.get("upstreamData", {})

    # Get the upstream alignment data to merge into the draft payload inputs
    alignment_data = upstream_data.get("alignmentData", None)

    # Get the current draft workflow run object from the API
    workflow_run = get_workflow_run_from_portal_run_id(
        portal_run_id=portal_run_id
    )

    # The draft payload may be empty ({}) or None when the workflow run has no
    # payload yet (get_draft_payload returns {"payload": {}} in that case).
    # Guard against missing 'data' before accessing payload['data'].
    if payload is None:
        payload = {}
    if 'data' not in payload or payload['data'] is None:
        payload['data'] = {}

    # Merge the upstream alignment data into the draft payload inputs, but do
    # not overwrite alignment data that has already been resolved.
    data_object = payload['data'].copy()
    if data_object.get("inputs", None) is None:
        data_object["inputs"] = {}
    if data_object["inputs"].get("alignmentData", None) is None:
        data_object["inputs"]["alignmentData"] = alignment_data

    merged_payload = {
        "version": payload.get('version'),
        "data": data_object
    }

    # Determine the libraries to attach - fall back to the workflow run object's
    # libraries when not provided on the event.
    if libraries is None:
        libraries = workflow_run.get("libraries", [])

    # Build the complete workflow run update object
    workflow_run_update = {
        "orcabusId": workflow_run["orcabusId"],
        "portalRunId": workflow_run["portalRunId"],
        "status": "DRAFT",
        "workflow": workflow_run["workflow"],
        "workflowRunName": workflow_run["workflowRunName"],
        "libraries": list(map(
            lambda lib: {
                "libraryId": lib["libraryId"],
                "orcabusId": lib["orcabusId"],
                "readsets": lib.get("readsets", []),
            },
            libraries
        )),
        "payload": merged_payload,
    }

    return {
        "workflowRunUpdate": workflow_run_update
    }
