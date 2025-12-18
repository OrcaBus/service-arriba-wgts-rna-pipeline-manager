#!/usr/bin/env python3

"""
1 Get the latest succeeded workflow for a given library id
2 Get the BAM file from that workflow
"""

# Standard imports
from typing import Dict
from pathlib import Path
from urllib.parse import urlparse, urlunparse

# Layer imports
from orcabus_api_tools.filemanager import list_files_from_portal_run_id
from orcabus_api_tools.workflow import get_latest_payload_from_portal_run_id

# Globals
DRAGEN_WGTS_RNA_WORKFLOW_RUN_NAME = "dragen-wgts-rna"

def extend_s3_uri_path(analysis_root_prefix: str, path: str) -> str:
    s3_obj = urlparse(analysis_root_prefix)

    return str(urlunparse((
        s3_obj.scheme, s3_obj.netloc,
        str(Path(s3_obj.path) / path) + ("/" if path.endswith("/") else ""),
        None, None, None
    )))

def get_portal_run_id_root_prefix(portal_run_id: str) -> str:
    # Get portal run id midfix from portal_run_id
    all_portal_run_id_files = list_files_from_portal_run_id(
        portal_run_id
    )

    all_portal_run_id_files = list(filter(
        lambda file_iter_: '/cache/' not in file_iter_['key'],
        all_portal_run_id_files
    ))

    if len(all_portal_run_id_files) == 0:
        raise ValueError(f"No files found for portal run id {portal_run_id}")
    portal_run_id_analysis_file = all_portal_run_id_files[0]

    # Get root for the portal run id
    parts_list = []
    for idx, part in enumerate(Path(portal_run_id_analysis_file['key']).parts):
        if part == portal_run_id:
            parts_list.append(part)
            break
        else:
            parts_list.append(part)
    return str(urlunparse((
        "s3", portal_run_id_analysis_file['bucket'], str("/".join(parts_list)), None, None, None
    )))


def get_alignment_data(
        portal_run_id: str,
) -> Dict[str, str]:

    # Portal run id prefix
    portal_run_id_analysis_root_prefix = get_portal_run_id_root_prefix(portal_run_id)

    latest_payload_data = get_latest_payload_from_portal_run_id(
        portal_run_id=portal_run_id
    )['data']

    # Get output relative path
    output_relative_path = Path(latest_payload_data['outputs']['dragenRnaVariantCallingOutputRelPath'])

    # Get the bam file path
    bam_file = str(output_relative_path / (latest_payload_data['inputs']['sampleName'] + ".bam"))

    return {
        "bamInput": extend_s3_uri_path(portal_run_id_analysis_root_prefix, bam_file)
    }


def handler(event, context):
    """
    Given a normal and tumor library id, get the latest dragen workflow and return the bam files
    :param event:
    :param context:
    :return:
    """
    # Get the library ids from the event
    portal_run_id = event.get('portalRunId', None)

    return get_alignment_data(
        portal_run_id=portal_run_id,
    )
