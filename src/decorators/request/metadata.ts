import { MethodMetadata } from '../../metadatas';

/**
 * 元数据
 */
export class Metadata<T = MetadataOption> extends MethodMetadata<T> {}

export interface MetadataOption {
  readonly path?: string;
  readonly method?: string;
}
