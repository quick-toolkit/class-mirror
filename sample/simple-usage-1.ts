import { MethodMirror } from '../src';
import { request } from './decorators';
import { entity, param, property } from './decorators';

const name = Symbol('test');

@entity({ title: 'SimpleUsage1' })
/**
 * SimpleUsage1
 */
export class SimpleUsage1 {
  /**
   * 构造函数
   * @param path
   */
  public constructor(public path: string) {}

  @property({
    title: 'id',
  })
  public id: number;

  @property({
    title: 'SimpleUsage1',
  })
  public name: string;

  @property
  public static test: string;

  /**
   * 测试
   */
  @request({
    path: '/info',
    method: 'post',
  })
  public info(): Number {
    console.log(MethodMirror.reflect(SimpleUsage1, this.info, false));
    return 1;
  }

  /**
   * test
   */
  @request({
    path: '/test',
    method: 'post',
  })
  public static [name](): number {
    return 1;
  }

  /**
   * 测试 获取metadataKeys
   */
  @request({
    path: '/getMetadataKeys',
    method: 'post',
  })
  public static getMetadataKeys(): Number {
    return 1;
  }

  /**
   * 测试实例成员函数run
   * @param path
   * @param test
   */
  @request({
    path: '/run',
    method: 'get',
  })
  public run(
    @param({ path: 'param.run' }) path: string,
    @param test: number
  ): string {
    return this.name + path + test.toString();
  }

  /**
   * 测试静态成员函数
   * @param path
   */
  @request({
    path: '/static/run',
    method: 'get',
  })
  public static run(
    @param({ path: '/static/param.run' }) path: string
  ): boolean {
    return true;
  }

  /**
   * 测试1
   * @param test
   */
  public test1(@param test: string): Number {
    return 1;
  }
}
