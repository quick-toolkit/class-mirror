import 'reflect-metadata';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ClassMirror } from '../src';
import { SimpleUsage3 } from '../sample/simple-usage-3';

describe('simple-usage-3.spec.ts', () => {
  const classMirror = ClassMirror.reflect(SimpleUsage3);
  it('should match members length. ', function () {
    expect(classMirror.parentClassMirror).instanceof(ClassMirror);
    expect(classMirror.getParameters().size).eq(2);
  });
});
