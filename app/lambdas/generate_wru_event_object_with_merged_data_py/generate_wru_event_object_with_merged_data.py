#!/usr/bin/env python3

"""
Generate a WRU event object with merged data
"""
# Layer imports
from orcabus_api_tools.workflow import (
    get_workflow_run_from_portal_run_id
)


def handler(event, context):
    """
    Generate WRU event object with merged data
    :param event:
    :param context:
    :return:
    """

    # Get the event inputs
    # Get the event inputs
    portal_run_id = event.get("portalRunId", None)
    libraries = event.get("libraries", None)
    payload = event.get("payload", None)
    upstream_data = event.get("upstreamData", {})

    # Get the draft workflow run data
    alignment_data = upstream_data.get('alignmentData', None)

    # Create a copy of the oncoanalyser draft workflow run object to update
    draft_workflow_run = get_workflow_run_from_portal_run_id(
        portal_run_id=portal_run_id
    )

    # Make a copy
    draft_workflow_update = draft_workflow_run.copy()

    # Remove 'currentState' and replace with 'status'
    draft_workflow_update['status'] = draft_workflow_update.pop('currentState')['status']

    # Add in the libraries if provided
    if libraries is not None:
        draft_workflow_update["libraries"] = list(map(
            lambda library_iter: {
                "libraryId": library_iter['libraryId'],
                "orcabusId": library_iter['orcabusId'],
                "readsets": library_iter.get('readsets', [])
            },
            libraries
        ))

    # First check if the oncoanalyser draft workflow object has the fields we would update with the

    # Generate a workflow run update object with the merged data
    if (
            (
                    payload['data'].get("inputs", {}).get("alignmentData", None) is not None
            )
    ):
        # Return the OG, we dont want to overwrite existing data
        draft_workflow_update["payload"] = {
            "version": payload['version'],
            "data": payload['data']
        }
        return {
            "workflowRunUpdate": draft_workflow_update
        }

    if payload['data'].get("inputs", {}) is None:
        payload['data']['inputs'] = {}

    if (
            payload['data'].get("inputs", {}).get("alignmentData", None) is None
    ):
        # Get the dragen draft payload tumor and normal bam uris
        payload['data']['inputs']['alignmentData'] = alignment_data

    # Merge the data from the dragen draft payload into the oncoanalyser draft payload
    new_data_object = payload['data'].copy()
    if new_data_object.get("inputs", None) is None:
        new_data_object["inputs"] = {}

    # Update the inputs with the dragen draft payload data
    draft_workflow_update["payload"] = {
        "version": payload['version'],
        "data": new_data_object
    }

    return {
        "workflowRunUpdate": draft_workflow_update
    }
