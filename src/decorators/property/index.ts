/**
 * property decorator 示例
 */

import { PropertyMirror } from '../../mirrors';
import { Metadata, MetadataOption } from './metadata';

/**
 * @hide
 * 带参属性装饰器
 * @param options
 */
export function property(options: MetadataOption): PropertyDecorator;
/**
 * 无参数属性装饰器
 * @param target
 * @param propertyKey
 */
export function property(target: Object, propertyKey: string | symbol): void;
/**
 * 装饰器实现方法
 * @param args
 */
export function property(...args: unknown[]): PropertyDecorator | void {
  if (args.length === 1) {
    const [metadata] = args as [MetadataOption];
    return PropertyMirror.createDecorator(new Metadata(metadata));
  } else {
    const [target, propertyKey] = args as [Object, string];
    PropertyMirror.createDecorator(new Metadata(undefined))(
      target,
      propertyKey
    );
  }
}
