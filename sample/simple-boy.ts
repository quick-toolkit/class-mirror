import { entity, property } from '../src/decorators';
import { SimplePerson } from './simple-person';

@entity({ title: 'SimplePerson' })
/**
 * SimpleUsage1
 */
export class SimpleBoy extends SimplePerson {
  @property
  public age: number;
}
