import { entity, property } from './decorators';
import { SimplePerson } from './simple-person';

@entity({ title: 'SimplePerson' })
/**
 * SimpleUsage1
 */
export class SimpleBoy extends SimplePerson {
  @property
  public age: number;
}
