import { ParameterMetadata } from '../../metadatas';

/**
 * @class Metadata
 */
export class Metadata<T = MetadataOption> extends ParameterMetadata<T> {}

export interface MetadataOption {
  readonly path: string;
}
