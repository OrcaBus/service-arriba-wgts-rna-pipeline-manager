import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { BuildSsmParameterProps } from './interfaces';

import * as path from 'path';

export function buildSsmParameters(scope: Construct, props: BuildSsmParameterProps) {
  /**
   * SSM Stack here
   *
   * */

  /**
   * Detail Level SSM Parameters
   */
  // Workflow name
  new ssm.StringParameter(scope, 'workflow-name', {
    parameterName: props.ssmParameterPaths.workflowName,
    stringValue: props.ssmParameterValues.workflowName,
  });

  // Workflow version
  new ssm.StringParameter(scope, 'workflow-version', {
    parameterName: props.ssmParameterPaths.workflowVersion,
    stringValue: props.ssmParameterValues.workflowVersion,
  });

  /**
   * Payload level SSM Parameters
   */
  // Payload version
  new ssm.StringParameter(scope, 'payload-version', {
    parameterName: props.ssmParameterPaths.payloadVersion,
    stringValue: props.ssmParameterValues.payloadVersion,
  });

  /**
   * Engine Parameters
   */
  // ICAV2 project ID
  new ssm.StringParameter(scope, 'icav2-project-id', {
    parameterName: props.ssmParameterPaths.icav2ProjectId,
    stringValue: props.ssmParameterValues.icav2ProjectId,
  });

  // Prefix pipeline IDs by workflow version
  for (const [key, value] of Object.entries(
    props.ssmParameterValues.pipelineIdsByWorkflowVersionMap
  )) {
    new ssm.StringParameter(scope, `pipeline-id-${key}`, {
      parameterName: path.join(props.ssmParameterPaths.prefixPipelineIdsByWorkflowVersion, key),
      stringValue: value,
    });
  }

  // Logs Prefix
  new ssm.StringParameter(scope, 'logs-prefix', {
    parameterName: props.ssmParameterPaths.logsPrefix,
    stringValue: props.ssmParameterValues.logsPrefix,
  });

  // Output prefix
  new ssm.StringParameter(scope, 'output-prefix', {
    parameterName: props.ssmParameterPaths.outputPrefix,
    stringValue: props.ssmParameterValues.outputPrefix,
  });

  /**
   * Reference Parameters
   */

  // Annotation by workflow version map
  for (const [key, value] of Object.entries(
    props.ssmParameterValues.annotationVersionByWorkflowVersionMap
  )) {
    new ssm.StringParameter(scope, `annotation-version-by-workflow-version-${key}`, {
      parameterName: path.join(
        props.ssmParameterPaths.annotationVersionByWorkflowSsmRootPrefix,
        key
      ),
      stringValue: value,
    });
  }

  // Annotation by workflow version map
  for (const [key, value] of Object.entries(
    props.ssmParameterValues.annotationPathsByAnnotationVersionMap
  )) {
    new ssm.StringParameter(scope, `annotation-reference-path-by-annotation-version-${key}`, {
      parameterName: path.join(
        props.ssmParameterPaths.annotationPathsByAnnotationSsmRootPrefix,
        key
      ),
      stringValue: value,
    });
  }

  // Cytobands by workflow version map
  for (const [key, value] of Object.entries(
    props.ssmParameterValues.cytobandsPathsByWorkflowVersionMap
  )) {
    new ssm.StringParameter(scope, `cytobands-path-by-workflow-version-${key}`, {
      parameterName: path.join(props.ssmParameterPaths.cytobandsPathsByWorkflowSsmRootPrefix, key),
      stringValue: value,
    });
  }

  // Protein domains by workflow version map
  for (const [key, value] of Object.entries(
    props.ssmParameterValues.protenDomainPathsByWorkflowVersionMap
  )) {
    new ssm.StringParameter(scope, `protein-domains-path-by-workflow-version-${key}`, {
      parameterName: path.join(
        props.ssmParameterPaths.protenDomainPathsByWorkflowSsmRootPrefix,
        key
      ),
      stringValue: value,
    });
  }

  // Blacklist by workflow version map
  for (const [key, value] of Object.entries(
    props.ssmParameterValues.blacklistPathsByWorkflowVersionMap
  )) {
    new ssm.StringParameter(scope, `blacklist-path-by-workflow-version-${key}`, {
      parameterName: path.join(props.ssmParameterPaths.blacklistPathsByWorkflowSsmRootPrefix, key),
      stringValue: value,
    });
  }

  // Reference by workflow version map
  for (const [key, value] of Object.entries(
    props.ssmParameterValues.referenceVersionByWorkflowVersionMap
  )) {
    new ssm.StringParameter(scope, `reference-version-by-workflow-version-${key}`, {
      parameterName: path.join(
        props.ssmParameterPaths.referenceVersionByWorkflowSsmRootPrefix,
        key
      ),
      stringValue: value,
    });
  }

  // Annotation by workflow version map
  for (const [key, value] of Object.entries(
    props.ssmParameterValues.referenceFastaPathsByReferenceFastaVersionMap
  )) {
    new ssm.StringParameter(scope, `reference-fasta-path-by-reference-version-${key}`, {
      parameterName: path.join(
        props.ssmParameterPaths.referenceFastaPathsByReferenceFastaSsmRootPrefix,
        key
      ),
      stringValue: value,
    });
  }
}
