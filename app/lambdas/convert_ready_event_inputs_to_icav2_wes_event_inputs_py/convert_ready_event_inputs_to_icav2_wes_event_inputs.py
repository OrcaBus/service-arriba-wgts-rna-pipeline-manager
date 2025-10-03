#!/usr/bin/env python3

"""
BCLConvert InteropQC ready to ICAv2 WES request

Given a BCLConvert InteropQC ready event object, convert this to an ICAv2 WES request event detail

Inputs are as follows:

{
  // Data inputs
  "sampleName": "L2301197",
  "alignmentData": {
    "bamInput": "s3://data-bucket/path/to/bam/file.bam",
  },
  // Reference inputs
  "referenceFasta": "s3://ref-databucket/path/to/reference/hg38.fa",
  "annotationGtf": "s3://ref-databucket/path/to/gencode/gencode-annotation.gtf",
  "cytobandsTsv": "s3://ref-databucket/path/to/cytobands/cytobands.txt",
  "proteinDomainsGff3": "s3://ref-databucket/path/to/protein/protein.gff3",
  "blacklistTsv": "s3://ref-databucket/path/to/blacklist/blacklist.tsv",
}

With the outputs as follows:

{
  "alignment_data": {
    "bam_input": {
      "class": "File",
      "location": "s3://data-bucket/path/to/bam/file.bam",
      "secondaryFiles": [
        {
          "class": "File",
          "location": "s3://data-bucket/path/to/bam/file.bam.bai"
        }
      ]
    }
  },
  "reference_fasta": {
    "class": "File",
    "location": "s3://ref-databucket/path/to/reference/hg38.fa"
  },
  "annotation_gtf": {
    "class": "File",
    "location": "s3://ref-databucket/path/to/gencode/gencode-annotation.gtf"
  },
  "cytobands_tsv": {
    "class": "File",
    "location": "s3://ref-databucket/path/to/cytobands/cytobands.txt"
  },
  "protein_domains_gff3": {
    "class": "File",
    "location": "s3://ref-databucket/path/to/protein/protein.gff3"
  },
  "blacklist_tsv": {
    "class": "File",
    "location": "s3://ref-databucket/path/to/blacklist/blacklist.tsv"
  },
}

"""

# Imports
from typing import Dict, Any, Union, List

REFERENCE_FILE_KEYS = [
    "referenceFasta",
    "annotationGtf",
    "cytobandsTsv",
    "proteinDomainsGff3",
    "blacklistTsv",
]


def to_snake_case(s: str) -> str:
    """
    Convert a string to snake_case.
    :param s: The input string.
    :return: The snake_case version of the input string.
    """
    return ''.join(['_' + c.lower() if c.isupper() else c for c in s]).lstrip('_')


def recursive_snake_case(d: Union[Dict[str, Any] | List[Any] | str]) -> Any:
    """
    Convert all keys in a dictionary to snake_case recursively.
    If the value is a list, we also need to convert each item in the list if it is a dictionary.
    :param d:
    :return:
    """
    if not isinstance(d, dict) and not isinstance(d, list):
        return d

    if isinstance(d, dict):
        return {to_snake_case(k): recursive_snake_case(v) for k, v in d.items()}

    return [recursive_snake_case(item) for item in d]


def cwlify_file(file_uri: str) -> Dict[str, str]:
    return {
        "class": "File",
        "location": file_uri
    }


def handler(event, context) -> Dict[str, Any]:
    """
    Convert the BCLConvert InteropQC ready event to an ICAv2 WES request event detail.
    :param event:
    :param context:
    :return:
    """
    inputs = event['inputs']

    # cwl-ify the inputs
    inputs['alignmentData'] = (
        {k: cwlify_file(v) for k, v in inputs['alignmentData'].items()}
    )

    # cwl-ify the reference data
    for key in REFERENCE_FILE_KEYS:
        if key not in inputs:
            continue
        inputs[key] = cwlify_file(inputs[key])

    inputs = recursive_snake_case(inputs)

    # Add in the bam index
    if 'bam_input' in inputs.get('alignment_data', {}):
        bam_input = inputs['alignment_data']['bam_input']
        bam_index = bam_input['location'] + '.bai'
        bam_input['secondaryFiles'] = [cwlify_file(bam_index)]
        inputs['alignment_data']['bam_input'] = bam_input

    # Add the fai index
    if 'reference_fasta' in inputs:
        reference_fasta = inputs['reference_fasta']
        reference_fai = reference_fasta['location'] + '.fai'
        reference_fasta['secondaryFiles'] = [cwlify_file(reference_fai)]
        inputs['reference_fasta'] = reference_fasta

    # Return the inputs
    return {
        "inputs": inputs
    }
