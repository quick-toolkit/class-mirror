import { DeclarationMetadata } from '../declaration-metadata';
import { ClassMirror } from '../../mirrors';

/**
 * @class PropertyMetadata
 */
export class PropertyMetadata<T = any> extends DeclarationMetadata<T> {
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
