export type SchemaNames = 'completeDataDraft';

export const schemaNamesList: SchemaNames[] = ['completeDataDraft'];

export interface BuildSchemaProps {
  registryName: string;
  schemaName: SchemaNames;
}
