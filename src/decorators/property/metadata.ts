import { PropertyMetadata } from '../../metadatas';

/**
 * Metadata
 */
export class Metadata<T = MetadataOption> extends PropertyMetadata<T> {}

export interface MetadataOption {
  readonly title?: string;
}
