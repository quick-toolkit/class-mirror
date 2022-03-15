import { PropertyDecorate } from '../../../src';

/**
 * Metadata
 */
export class Metadata<T = MetadataOption> extends PropertyDecorate<T> {}

export interface MetadataOption {
  readonly title?: string;
}
