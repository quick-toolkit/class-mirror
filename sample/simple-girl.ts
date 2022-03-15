import { entity } from './decorators';
import { SimplePerson } from './simple-person';

@entity({ title: 'SimplePerson' })
/**
 * SimpleUsage1
 */
export class SimpleGirl extends SimplePerson {}
