import { ClassDecorate } from '../../../src';

/**
 * 元数据
 */
export class Metadata<T = MetadataOption> extends ClassDecorate<T> {}

export interface MetadataOption {
  readonly title: string;
}
