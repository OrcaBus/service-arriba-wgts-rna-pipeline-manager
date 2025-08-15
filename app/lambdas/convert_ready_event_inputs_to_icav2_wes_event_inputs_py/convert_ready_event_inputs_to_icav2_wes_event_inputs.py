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
    "referenceFasta"
    "annotationGtf"
    "cytobandsTsv"
    "proteinDomainsGff3"
    "blacklistTsv"
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
        if not key in inputs:
            continue
        inputs[key] = cwlify_file(inputs[key])

    return {
        "inputs": recursive_snake_case(inputs)
    }


# if __name__ == "__main__":
#     import json
#
#     print(
#         json.dumps(
#             handler(
#                 event={
#                     "dragenWgtsDnaReadyEventDetail": {
#                         "portalRunId": "20250606efgh1234",
#                         "timestamp": "2025-06-06T04:39:31+00:00",
#                         "status": "READY",
#                         "workflowName": "dragen-wgts-dna",
#                         "workflowVersion": "4.4.4",
#                         "workflowRunName": "umccr--automated--dragen-wgts-dna--4-4-4--20250606efgh1234",
#                         "linkedLibraries": [
#                             {
#                                 "libraryId": "L2301197",
#                                 "orcabusId": "lib.01JBMVHM2D5GCC7FTC20K4FDFK"
#                             }
#                         ],
#                         "payload": {
#                             "refId": "4d8b4468-55da-490f-8aab-0adcaed3fc33",
#                             "version": "2025.06.06",
#                             "data": {
#                                 "inputs": {
#                                     "alignmentOptions": {
#                                         "enableDuplicateMarking": True
#                                     },
#                                     "reference": {
#                                         "name": "hg38",
#                                         "structure": "graph",
#                                         "tarball": "s3://pipeline-prod-cache-503977275616-ap-southeast-2/byob-icav2/reference-data/dragen-hash-tables/v11-r5/hg38-alt_masked-cnv-graph-hla-methyl_cg-rna/hg38-alt_masked.cnv.graph.hla.methyl_cg.rna-11-r5.0-1.tar.gz"
#                                     },
#                                     "oraReference": "s3://pipeline-prod-cache-503977275616-ap-southeast-2/byob-icav2/reference-data/dragen-ora/v2/ora_reference_v2.tar.gz",
#                                     "sampleName": "L2301197",
#                                     "targetedCallerOptions": {
#                                         "enableTargeted": [
#                                             "cyp2d6"
#                                         ]
#                                     },
#                                     "sequenceData": {
#                                         "fastqListRows": [
#                                             {
#                                                 "rgid": "L2301197",
#                                                 "rglb": "L2301197",
#                                                 "rgsm": "L2301197",
#                                                 "lane": 1,
#                                                 "read1FileUri": "s3://pipeline-dev-cache-503977275616-ap-southeast-2/byob-icav2/development/test_data/ora-testing/input_data/MDX230428_L2301197_S7_L004_R1_001.fastq.ora",
#                                                 "read2FileUri": "s3://pipeline-dev-cache-503977275616-ap-southeast-2/byob-icav2/development/test_data/ora-testing/input_data/MDX230428_L2301197_S7_L004_R2_001.fastq.ora"
#                                             }
#                                         ]
#                                     },
#                                     "snv_variant_caller_options": {
#                                         "enableVcfCompression": True,
#                                         "enableVcfIndexing": True,
#                                         "qcDetectContamination": True,
#                                         "vcMnvEmitComponentCalls": True,
#                                         "vcCombinePhasedVariantsDistance": 2,
#                                         "vcCombinePhasedVariantsDistanceSnvsOnly": 2
#                                     }
#                                 },
#                                 "engineParameters": {
#                                     "pipelineId": "5009335a-8425-48a8-83c4-17c54607b44a",
#                                     "projectId": "ea19a3f5-ec7c-4940-a474-c31cd91dbad4",
#                                     "outputUri": "s3://pipeline-dev-cache-503977275616-ap-southeast-2/byob-icav2/development/analysis/dragen-wgts-dna/20250606efgh1234/",
#                                     "logsUri": "s3://pipeline-dev-cache-503977275616-ap-southeast-2/byob-icav2/development/logs/dragen-wgts-dna/20250606efgh1234/"
#                                 },
#                                 "tags": {
#                                     "libraryId": "L2301197"
#                                 }
#                             }
#                         }
#                     },
#                     "defaultPipelineId": "5009335a-8425-48a8-83c4-17c54607b44a",
#                     "defaultProjectId": "ea19a3f5-ec7c-4940-a474-c31cd91dbad4"
#                 },
#                 context=None
#             ),
#             indent=4
#         )
#     )
#
#     # {
#     #     "icav2WesRequestEventDetail": {
#     #         "name": "umccr--automated--dragen-wgts-dna--4-4-4--20250606efgh1234",
#     #         "inputs": {
#     #             "alignment_options": {
#     #                 "enable_duplicate_marking": true
#     #             },
#     #             "reference": {
#     #                 "name": "hg38",
#     #                 "structure": "graph",
#     #                 "tarball": {
#     #                     "class": "File",
#     #                     "location": "s3://pipeline-prod-cache-503977275616-ap-southeast-2/byob-icav2/reference-data/dragen-hash-tables/v11-r5/hg38-alt_masked-cnv-graph-hla-methyl_cg-rna/hg38-alt_masked.cnv.graph.hla.methyl_cg.rna-11-r5.0-1.tar.gz"
#     #                 }
#     #             },
#     #             "ora_reference": {
#     #                 "class": "File",
#     #                 "location": "s3://pipeline-prod-cache-503977275616-ap-southeast-2/byob-icav2/reference-data/dragen-ora/v2/ora_reference_v2.tar.gz"
#     #             },
#     #             "sample_name": "L2301197",
#     #             "targeted_caller_options": {
#     #                 "enable_targeted": [
#     #                     "cyp2d6"
#     #                 ]
#     #             },
#     #             "sequence_data": {
#     #                 "fastq_list_rows": [
#     #                     {
#     #                         "rgid": "L2301197",
#     #                         "rglb": "L2301197",
#     #                         "rgsm": "L2301197",
#     #                         "lane": 1,
#     #                         "read_1": {
#     #                             "class": "File",
#     #                             "location": "s3://pipeline-dev-cache-503977275616-ap-southeast-2/byob-icav2/development/test_data/ora-testing/input_data/MDX230428_L2301197_S7_L004_R1_001.fastq.ora"
#     #                         },
#     #                         "read_2": {
#     #                             "class": "File",
#     #                             "location": "s3://pipeline-dev-cache-503977275616-ap-southeast-2/byob-icav2/development/test_data/ora-testing/input_data/MDX230428_L2301197_S7_L004_R2_001.fastq.ora"
#     #                         }
#     #                     }
#     #                 ]
#     #             },
#     #             "snv_variant_caller_options": {
#     #                 "enable_vcf_compression": true,
#     #                 "enable_vcf_indexing": true,
#     #                 "qc_detect_contamination": true,
#     #                 "vc_mnv_emit_component_calls": true,
#     #                 "vc_combine_phased_variants_distance": 2,
#     #                 "vc_combine_phased_variants_distance_snvs_only": 2
#     #             }
#     #         },
#     #         "engineParameters": {
#     #             "outputUri": "s3://pipeline-dev-cache-503977275616-ap-southeast-2/byob-icav2/development/analysis/dragen-wgts-dna/20250606efgh1234/",
#     #             "logsUri": "s3://pipeline-dev-cache-503977275616-ap-southeast-2/byob-icav2/development/logs/dragen-wgts-dna/20250606efgh1234/",
#     #             "projectId": "ea19a3f5-ec7c-4940-a474-c31cd91dbad4",
#     #             "pipelineId": "5009335a-8425-48a8-83c4-17c54607b44a"
#     #         },
#     #         "tags": {
#     #             "libraryId": "L2301197",
#     #             "portalRunId": "20250606efgh1234"
#     #         }
#     #     }
#     # }
