/**
 * 声明元数据
 */
export abstract class DeclarationMetadata<T = any> {
  /**
   * target
   * 元数据目标
   */
  public target: Object;

  /**
   * constructor
   * 构造函数
   * @param metadata 元数据对象
   */
  public constructor(public metadata: T) {}
}
