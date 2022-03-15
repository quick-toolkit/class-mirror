import { ClassMetadata } from '../../metadatas';

/**
 * 元数据
 */
export class Metadata<T = MetadataOption> extends ClassMetadata<T> {}

export interface MetadataOption {
  readonly title: string;
}
