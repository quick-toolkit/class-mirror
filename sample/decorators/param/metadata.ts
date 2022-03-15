import { ParameterDecorate } from '../../../src';

/**
 * @class Metadata
 */
export class Metadata<T = MetadataOption> extends ParameterDecorate<T> {}

export interface MetadataOption {
  readonly path: string;
}
