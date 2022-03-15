import { DeclarationDecorate } from '../declaration-decorate';
import { ClassMirror } from '../../mirrors';

/**
 * class元数据
 * @class ClassDecorate
 */
export abstract class ClassDecorate<T = any> extends DeclarationDecorate<T> {
  /**
   * classMirror
   * 元数据所属的ClassMirror
   */
  public classMirror: ClassMirror;
}
