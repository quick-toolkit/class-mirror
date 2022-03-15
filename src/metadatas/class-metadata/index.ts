import { DeclarationMetadata } from '../declaration-metadata';
import { ClassMirror } from '../../mirrors';

/**
 * class元数据
 * @class ClassMetadata
 */
export abstract class ClassMetadata<T = any> extends DeclarationMetadata<T> {
  /**
   * classMirror
   * 元数据所属的ClassMirror
   */
  public classMirror: ClassMirror;
}
