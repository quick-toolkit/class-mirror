/**
 * @hide
 * 参数装饰器示例
 */
import { ParameterMirror } from '../../../src';
import { Metadata, MetadataOption } from './metadata';

/**
 * 无参装饰器
 * @param target
 * @param propertyKey
 * @param parameterIndex
 */
export function param(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
): void;
/**
 * 带参数装饰器
 * @param option
 */
export function param(option: MetadataOption): ParameterDecorator;
/**
 * 装饰器实现
 * @param args
 */
export function param(...args: unknown[]): ParameterDecorator | void {
  if (args.length === 1) {
    const [option] = args as [MetadataOption];
    return ParameterMirror.createDecorator(new Metadata(option));
  } else {
    const [target, propertyKey, parameterIndex] = args as [
      Object,
      string | symbol,
      number
    ];
    return ParameterMirror.createDecorator(new Metadata(null))(
      target,
      propertyKey,
      parameterIndex
    );
  }
}
