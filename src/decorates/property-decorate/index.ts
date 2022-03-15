import { DeclarationDecorate } from '../declaration-decorate';
import { ClassMirror } from '../../mirrors';

/**
 * @class PropertyDecorate
 */
export class PropertyDecorate<T = any> extends DeclarationDecorate<T> {
  /**
   * classMirror
   * 元数据所属的 ClassMirror
   */
  public classMirror: ClassMirror;

  /**
   * propertyKey
   * 元数据所属的 key 名称
   */
  public propertyKey: string | symbol;
}
