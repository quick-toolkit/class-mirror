import { entity, param, property, request } from '../src/decorators';
import { SimpleGirl } from './simple-girl';
import { SimpleBoy } from './simple-boy';
import { SimpleUsage1 } from './simple-usage-1';

@entity({ title: 'SimpleUsage2' })
/**
 * SimpleUsage1
 */
export class SimpleUsage2 extends SimpleUsage1 {
  @property({
    title: 'SimpleUsage2',
  })
  public name = 'zhangsan';

  @property
  public girl: SimpleGirl;

  @property
  public boy: SimpleBoy;

  /**
   * 测试实例成员函数run
   * @param path
   * @param test
   */
  @request({
    path: '/run',
    method: 'post',
  })
  public run(
    @param({ path: 'param.run' }) path: string,
    @param test: number
  ): string {
    return this.name + path + test.toString();
  }
}
