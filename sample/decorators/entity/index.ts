import { ClassMirror } from '../../../src';
import { Metadata, MetadataOption } from './metadata';

/**
 * @hide
 * entity 装饰器
 * @param metadata
 */
export function entity(metadata: MetadataOption): ClassDecorator {
  return ClassMirror.createDecorator(new Metadata(metadata));
}
