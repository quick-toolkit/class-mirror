import 'reflect-metadata';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ClassMirror, MethodMirror, PropertyMirror } from '../src';
import { SimpleUsage2 } from '../sample/simple-usage-2';

describe('simple-usage-2.spec.ts', () => {
  const classMirror = ClassMirror.reflect(SimpleUsage2);
  it('should match members length.', function () {
    expect(classMirror.parentClassMirror).instanceof(ClassMirror);

    // 成员
    const propertiesMirrors = classMirror.getProperties();
    const staticPropertiesMirrors = classMirror.getStaticProperties();
    const propertiesMirrorsFromAll = classMirror.getAllProperties();

    expect(propertiesMirrors.size).eq(3);
    expect(propertiesMirrorsFromAll.size).eq(4);
    expect(staticPropertiesMirrors.size).eq(0);

    // 方法
    const methodMirrors = classMirror.getMethods();
    const staticMethodMirrors = classMirror.getStaticMethods();
    const methodMirrorsFromAll = classMirror.getAllMethods();

    expect(methodMirrors.size).eq(1);
    expect(staticMethodMirrors.size).eq(0);
    expect(methodMirrorsFromAll.size).eq(3);

    const propertyMirror = PropertyMirror.reflect(SimpleUsage2, 'name');

    if (propertyMirror) {
      // 包含父类的一个装饰器 总共两个装饰器
      expect(propertyMirror.getAllMetadata().length).eq(2);
      // 不包含父类 所以只有一个装饰器
      expect(propertyMirror.metadata.size).eq(1);
    }
  });

  it('should MethodMirror.reflect return MethodMirror.', function () {
    const methodMirror = MethodMirror.reflect(SimpleUsage2, 'run');

    if (methodMirror) {
      // 不包含父类 只有一个
      expect(methodMirror.metadata.size).eq(1);

      // 包含父类的装饰器 总共2个
      expect(methodMirror.getAllMetadata().length).eq(2);

      // 该函数的返回值为String
      expect(methodMirror.getReturnType()).eq(String);
    }

    const methodMirror1 = MethodMirror.reflect(
      SimpleUsage2,
      SimpleUsage2.run,
      true
    );
    const methodMirror2 = MethodMirror.reflect(SimpleUsage2, 'run', true);
    // 上面两种方式获取映射的 MethodMirror 其实是SimpleUsage2同一个静态方法 所以MethodMirror也是同一个
    expect(methodMirror1).eq(methodMirror2);

    if (methodMirror1) {
      // 此方法只有一个装饰器
      expect(methodMirror1.metadata.size).eq(1);
      // 此方法是静态方法，就算父类有相同的静态方法，allMetadata 也不会包含父类的元数据
      expect(methodMirror1.getAllMetadata().length).eq(
        methodMirror1.metadata.size
      );
    }
  });
});
