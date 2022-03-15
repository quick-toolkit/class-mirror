import 'reflect-metadata';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ClassMirror } from '../src';
import { SimpleGirl } from '../sample/simple-girl';

describe('simple-girl.spec.ts', () => {
  const classMirror = ClassMirror.reflect(SimpleGirl);

  it('should match members length.', function () {
    // 获取方法成员 含父类
    const methodMirrorsFromAll = classMirror.getAllMethods();
    // 获取属性成员 含父类
    const propertiesMirrorsFromAll = classMirror.getAllProperties();

    // 获取静态方法成员 不含父类
    const staticMethodMirrors = classMirror.getStaticMethods();
    // 获取静态属性成员 不含父类
    const staticPropertiesMirrors = classMirror.getStaticProperties();
    // 实例成员方法 不含父类
    const methodMirrors = classMirror.getMethods();
    // 实例属性成员 不含父类
    const propertiesMirrors = classMirror.getProperties();

    // 当前类 静态
    expect(staticMethodMirrors).instanceof(Map);
    expect(staticMethodMirrors.size).eq(0);
    expect(staticPropertiesMirrors).instanceof(Map);
    expect(staticPropertiesMirrors.size).eq(0);

    // 当前类 非静态
    expect(methodMirrors).instanceof(Map);
    expect(methodMirrors.size).eq(0);
    expect(propertiesMirrors).instanceof(Map);
    expect(propertiesMirrors.size).eq(0);

    // 含父类 非静态
    expect(methodMirrorsFromAll).instanceof(Map);
    expect(methodMirrorsFromAll.size).eq(0);
    expect(propertiesMirrorsFromAll).instanceof(Map);
    expect(propertiesMirrorsFromAll.size).eq(3);
  });
});
