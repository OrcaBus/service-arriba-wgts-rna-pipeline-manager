#!/usr/bin/env python3

"""
Get the libraries from the input, check their metadata,
"""
# Standard imports
from typing import List, Literal

# Layer imports
from orcabus_api_tools.metadata import get_library_from_library_orcabus_id
from orcabus_api_tools.metadata.models import LibraryBase

def handler(event, context):
    """
    Get the libraries from the input, check their metadata,
    :param event:
    :param context:
    :return:
    """
    libraries: List[LibraryBase] = event.get("libraries", [])
    if not libraries:
        raise ValueError("No libraries provided in the input")

    # Get library metadata for both libraries
    library_obj_list = list(map(
        lambda library_iter_: get_library_from_library_orcabus_id(library_iter_['orcabusId']),
        libraries
    ))

    if len(library_obj_list) != 1:
        raise ValueError("Exactly one library must be provided in the input")

    # If both libraries are provided, return their IDs
    return {
        "libraryId": library_obj_list[0]['libraryId'],
    }
