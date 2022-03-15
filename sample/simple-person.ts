import { entity, property } from './decorators';

@entity({ title: 'SimplePerson' })
/**
 * SimpleUsage1
 */
export class SimplePerson {
  @property
  public id: number;

  @property
  public name: string;

  @property
  public sex: number;
}
