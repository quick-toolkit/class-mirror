import { DeclarationMetadata } from '../declaration-metadata';
import { ClassMirror } from '../../mirrors';

/**
 * @class MethodMetadata
 * 方法元数据
 */
export class MethodMetadata<T = any, D = any> extends DeclarationMetadata<T> {
  /**
   * classMirror
   * 元数据所属的ClassMirror
   */
  public classMirror: ClassMirror;

  /**
   * propertyKey
   * 元数据的key名称
   */
  public propertyKey: string | symbol;

  /**
   * descriptor
   * 元数据的descriptor Object.getOwnPropertyDescriptor 的返回值
   */
  public descriptor: D;
}
