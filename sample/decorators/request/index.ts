import { MethodMirror } from '../../../src';
import { Metadata, MetadataOption } from './metadata';

/**
 * @hide
 * 方法装饰器示例
 */
export function request(metadata: MetadataOption): MethodDecorator {
  return MethodMirror.createDecorator(new Metadata(metadata));
}
