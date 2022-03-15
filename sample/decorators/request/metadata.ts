import { MethodDecorate } from '../../../src';

/**
 * 元数据
 */
export class Metadata<T = MetadataOption> extends MethodDecorate<T> {}

export interface MetadataOption {
  readonly path?: string;
  readonly method?: string;
}
