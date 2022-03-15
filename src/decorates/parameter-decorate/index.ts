import { DeclarationDecorate } from '../declaration-decorate';
import { ClassMirror, MethodMirror } from '../../mirrors';

/**
 * @class ParameterDecorate
 */
export class ParameterDecorate<T = any> extends DeclarationDecorate<T> {
  /**
   * classMirror
   * 元数据所属的 ClassMirror
   */
  public classMirror: ClassMirror;

  /**
   * methodMirror
   * 元数据所属的 MethodMirror
   */
  public methodMirror: MethodMirror;

  /**
   * propertyKey
   * 元数据所属的 key 名称
   */
  public propertyKey: string | symbol;

  /**
   * index
   * 元数据所在的参数位置
   */
  public index: number;
}
