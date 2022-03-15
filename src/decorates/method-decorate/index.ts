import { DeclarationDecorate } from '../declaration-decorate';
import { ClassMirror } from '../../mirrors';

/**
 * @class MethodDecorate
 * 方法元数据
 */
export class MethodDecorate<T = any, D = any> extends DeclarationDecorate<T> {
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
