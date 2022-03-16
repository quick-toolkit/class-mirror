import 'reflect-metadata';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ClassMirror, PropertyMirror } from '../src';
import { SimpleUsage1 } from '../sample/simple-usage-1';

describe('simple-usage-1.spec.ts', () => {
  const classMirror = ClassMirror.reflect(SimpleUsage1);
  it('should match members length.', function () {
    expect(classMirror.parentClassMirror).eq(null);

    // 成员
    const propertiesMirrors = classMirror.getProperties();
    const staticPropertiesMirrors = classMirror.getStaticProperties();
    const propertiesMirrorsFromAll = classMirror.getAllProperties();

    expect(propertiesMirrors.size).eq(2);
    expect(propertiesMirrorsFromAll.size).eq(2);
    expect(staticPropertiesMirrors.size).eq(2);

    // 方法
    const methodMirrors = classMirror.getMethods();
    const staticMethodMirrors = classMirror.getStaticMethods();
    const methodMirrorsFromAll = classMirror.getAllMethods();
    expect(methodMirrors.size).eq(3);
    expect(staticMethodMirrors.size).eq(4);
    expect(methodMirrorsFromAll.size).eq(3);

    // 因为构造函数未使用参数装饰器 所以是0
    expect(classMirror.getParameters().size).eq(0);
    expect(classMirror.getDesignParamTypes()).instanceof(Array);
    // 获取构造函数参数的数量可以使用此方法 但是必须使用了类装饰器/或者参数装饰器 否则获取不到
    expect(classMirror.getDesignParamTypes().length).eq(1);

    const propertyMirror = PropertyMirror.reflect(SimpleUsage1, 'name');

    if (propertyMirror) {
      // 获取当前类中指定成员的元数据数量
      expect(propertyMirror.decorates.size).eq(1);
      // 获取指定成员的元数据数量 包含父类
      expect(propertyMirror.getAllDecorates().length).eq(1);
    }
  });
});
