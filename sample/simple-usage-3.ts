import { entity, param } from './decorators';
import { SimpleUsage2 } from './simple-usage-2';

@entity({ title: 'SimpleUsage3' })
/**
 * SimpleUsage1
 */
export class SimpleUsage3 extends SimpleUsage2 {
  /**
   * test
   * @param path
   * @param index
   */
  public constructor(@param path: string, @param public index: number) {
    super(path);
  }
}
