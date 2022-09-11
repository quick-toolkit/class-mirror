/**
 * MIT License
 * Copyright (c) 2021 RanYunLong<549510622@qq.com> @quick-toolkit/class-mirror
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { DeclarationMirror } from '../declaration-mirror';
import { MethodMirror } from '../method-mirror';
import { PropertyMirror } from '../property-mirror';
import { ClassDecorate, ParameterDecorate } from '../../decorates';
import { ClassConstructor } from '../../interfaces';
import { ParameterMirror } from '../parameter-mirror';

/**
 * @class ClassMirror
 * 类映射
 */
export class ClassMirror<
  T extends ClassDecorate = any
> extends DeclarationMirror<T> {
  /**
   * 创建类装饰器
   * @param classDecorate
   * 使用此方法可以创建一个类装饰器
   */
  public static createDecorator(
    classDecorate: ClassDecorate | ClassDecorateFactory<ClassDecorate>
  ): ClassDecorator {
    return (target): void => {
      // 获取已有的类映射管理器 如果没有则创建一个新的
      const classMirror = ClassMirror.reflect(target);
      classMirror.target = target;
      if (typeof classDecorate === 'function') {
        classDecorate = classDecorate(target);
      }
      classDecorate.target = target;
      classDecorate.classMirror = classMirror;
      classMirror.decorates.add(classDecorate);
      // 反向映射实例
      Reflect.defineMetadata(classDecorate, classMirror, target);
      // 定义元数据
      Reflect.defineMetadata(ClassMirror, classMirror, target);
    };
  }

  /**
   * 获取映射数据
   * @param type
   * 使用此方法可以获取指定`type`上的 ClassMirror实例.
   */
  public static reflect<T extends Function>(type: T): ClassMirror {
    const metadata = Reflect.getMetadata(
      ClassMirror,
      type
    ) as DeclarationMirror;
    if (metadata instanceof ClassMirror) {
      if (metadata.target === type) {
        return metadata;
      } else {
        const classMirror = new ClassMirror();
        classMirror.parent = metadata;
        return classMirror;
      }
    }
    return new ClassMirror();
  }

  /**
   * 判断是否为静态成员
   * @param target
   */
  public static isStaticMember<T extends Object>(target: T): boolean {
    return target.constructor === Function;
  }

  /**
   * 父ClassMirror
   */
  public parent: ClassMirror | null = null;

  /**
   * 构造函数参数
   * 此处的`parameters.size`数量是构造函数使用了`ParameterMirror.createDecorator`创建的装饰的成员数量,
   * 要获取所有参数的数量，请使用方法 `[new ClassMirror].getDesignParamTypes`.
   */
  private readonly parameters: Map<number, ParameterMirror> = new Map();

  /**
   * Static members
   * 静态成员稽核
   */
  private readonly staticMembers: Map<
    string | symbol,
    MethodMirror | PropertyMirror
  > = new Map();

  /**
   * Instance members
   * 实例成员集合
   */
  private readonly instanceMembers: Map<
    string | symbol,
    MethodMirror | PropertyMirror
  > = new Map();

  /**
   * 获取所有元数据 包含父类
   */
  public getAllDecorates<M extends T = T>(type?: ClassConstructor<M>): M[] {
    const decorates = this.getDecorates(type);
    if (this.parent) {
      return decorates.concat(this.parent.getAllDecorates());
    }
    return decorates;
  }

  /**
   * 获取元数据集合
   * @param type 类型, 参数继承至 `ClassMetadata`。
   */
  public getDecorates<M extends T = T>(type?: ClassConstructor<M>): M[] {
    const decorates = Array.from<any>(this.decorates.values());
    if (type) {
      return decorates.filter((o) => o instanceof type) as M[];
    }
    return decorates as M[];
  }

  /**
   * 获取参数列表
   */
  public getParameters(): Map<number, ParameterMirror> {
    return new Map(this.parameters.entries());
  }

  /**
   * 获取指定位置的参数装饰器反射, 不包含父类（基类）.
   * @param index 装饰器位置
   */
  public getParameter<T extends ParameterDecorate>(
    index: number
  ): ParameterMirror<T> {
    return this.parameters.get(index) as ParameterMirror<T>;
  }

  /**
   * 设置指定位置的参数装饰器反射, 不包含父类（基类）.
   * @param index
   * @param mirror
   */
  public setParameter<T extends ParameterDecorate>(
    index: number,
    mirror: ParameterMirror<T>
  ): Map<number, ParameterMirror<T>> {
    return this.parameters.set(index, mirror) as Map<
      number,
      ParameterMirror<T>
    >;
  }

  /**
   * 获取构造函数参数类型, 不包含父类（基类）.
   */
  public getDesignParamTypes<T extends Function = Function>(): T[] {
    return Reflect.getMetadata('design:paramtypes', this.target) as T[];
  }

  /**
   *
   * @param propertyKey
   */
  public getStaticMethod(propertyKey: PropertyKey): MethodMirror | undefined {
    return this.getStaticMethods().get(propertyKey);
  }

  /**
   * 获取所有静态方法成员
   */
  public getStaticMethods(): Map<PropertyKey, MethodMirror> {
    const map = new Map<PropertyKey, MethodMirror>();
    this.staticMembers.forEach((value, key) => {
      if (value instanceof MethodMirror) {
        map.set(key, value);
      }
    });
    return map;
  }

  /**
   * 获取所有静态属性成员
   */
  public getStaticProperties(): Map<PropertyKey, PropertyMirror> {
    const map = new Map<PropertyKey, PropertyMirror>();
    this.staticMembers.forEach((value, key) => {
      if (value instanceof PropertyMirror) {
        map.set(key, value);
      }
    });
    return map;
  }

  /**
   * 获取所有实例方法成员 含父类（基类）中的实例成员方法
   */
  public getAllMethods(): Map<PropertyKey, MethodMirror> {
    const map = new Map<PropertyKey, MethodMirror>();
    const instanceMembers = this.getAllInstanceMembers();
    instanceMembers.forEach((value, key) => {
      if (value instanceof MethodMirror) {
        map.set(key, value);
      }
    });
    return map;
  }

  /**
   * 获取所有实例方法成员 不含父类（基类）中的实例成员方法
   */
  public getMethods(): Map<PropertyKey, MethodMirror> {
    const map = new Map<PropertyKey, MethodMirror>();
    const instanceMembers = this.getInstanceMembers();
    instanceMembers.forEach((value, key) => {
      if (value instanceof MethodMirror) {
        map.set(key, value);
      }
    });
    return map;
  }

  /**
   * 获取含父类（基类）中指定 `propertyKey` 的实例成员方法
   * @param propertyKey
   */
  public getMethod(propertyKey: PropertyKey): MethodMirror | undefined {
    return this.getAllMethods().get(propertyKey);
  }

  /**
   * 获取所有实例成员 含父类（基类）中的实例成员
   */
  public getAllProperties(): Map<PropertyKey, PropertyMirror> {
    const map = new Map<PropertyKey, PropertyMirror>();
    const instanceMembers = this.getAllInstanceMembers();
    instanceMembers.forEach((value, key) => {
      if (value instanceof PropertyMirror) {
        map.set(key, value);
      }
    });
    return map;
  }

  /**
   * 获取所有实例属性成员 不含父类（基类）中的实例成员
   */
  public getProperties(): Map<PropertyKey, PropertyMirror> {
    const map = new Map<PropertyKey, PropertyMirror>();
    const instanceMembers = this.getInstanceMembers();
    instanceMembers.forEach((value, key) => {
      if (value instanceof PropertyMirror) {
        map.set(key, value);
      }
    });
    return map;
  }

  /**
   * 获取含父类（基类）中指定 `propertyKey` 的实例成员
   * @param propertyKey
   */
  public getProperty(propertyKey: PropertyKey): PropertyMirror | undefined {
    return this.getAllProperties().get(propertyKey);
  }

  /**
   * 获取所有的实例成员 含父类（基类）中的实例成员
   */
  public getAllInstanceMembers(): Map<
    PropertyKey,
    MethodMirror | PropertyMirror
  > {
    if (this.parent) {
      const instanceMembers = this.parent.getAllInstanceMembers();
      this.instanceMembers.forEach((value, key) =>
        instanceMembers.set(key, value)
      );
      return instanceMembers;
    }
    return new Map(this.instanceMembers.entries());
  }

  /**
   * 获取实例成员 不含父类（基类）中的实例成员
   */
  public getInstanceMembers(): Map<PropertyKey, MethodMirror | PropertyMirror> {
    return new Map(this.instanceMembers.entries());
  }

  /**
   * 移除一个Mirror， 不含父类（基类）中的实例成员
   * Remove mirror
   * @param mirrorKey
   * @param isStatic
   */
  public removeMirror(mirrorKey: string | symbol, isStatic = false): void {
    if (isStatic) {
      this.staticMembers.delete(mirrorKey);
    } else {
      this.instanceMembers.delete(mirrorKey);
    }
  }

  /**
   * 获取所有的Mirror 含父类（基类）。
   * @param type 参数可以是 `MethodMirror` 或者 `PropertyMirror` 为 `undefined` 时 返回所有映射实例。
   * @param isStatic 是否获取静态成员。
   * 获取指定的 `mirror` 集合，需要指定 `type`。
   */
  public getAllMirrors<
    T extends PropertyMirror | MethodMirror = PropertyMirror | MethodMirror
  >(type: ClassConstructor<T> | undefined, isStatic = false): T[] {
    const currentMirrors = this.getMirrors(type, isStatic);
    if (this.parent) {
      const parentClassMirrors = this.parent.getAllMirrors(type, isStatic);
      return parentClassMirrors.concat(currentMirrors);
    }
    return currentMirrors;
  }

  /**
   * 获取所有的Mirror 不含父类（基类）。
   * @param type 参数可以是 `MethodMirror` 或者 `PropertyMirror` 为 `undefined` 时 返回所有映射实例。
   * @param isStatic 是否获取静态成员。
   * 获取指定的 `mirror` 集合，需要指定 `type`。
   */
  public getMirrors<
    T extends PropertyMirror | MethodMirror = PropertyMirror | MethodMirror
  >(type: ClassConstructor<T> | undefined, isStatic = false): T[] {
    const mirrors = Array.from(
      isStatic ? this.staticMembers.values() : this.instanceMembers.values()
    ) as T[];
    if (!type) {
      return mirrors;
    }
    return mirrors.filter((o) => o instanceof type);
  }

  /**
   * 获取 PropertyMirror, 不包含父类（基类）.
   * @param mirrorKey
   * @param isStatic
   * 根据元数据 `PropertyMetadata` 获取 `PropertyMirror`。
   */
  public getMirror<
    T extends MethodMirror | PropertyMirror = MethodMirror | PropertyMirror
  >(mirrorKey: string | symbol, isStatic = false): T | undefined {
    if (isStatic) {
      return this.staticMembers.get(mirrorKey) as T;
    } else {
      return this.instanceMembers.get(mirrorKey) as T;
    }
  }

  /**
   * 添加 mirror，只在当前类中添加
   * @param mirrorKey
   * @param mirror DeclarationMirror
   * @param isStatic 是否为静态成员
   * 使用该方法可以添加一个Mirror 可以是 MethodMirror 也可以是 PropertyMirror，
   * ParameterMirror不应添加至此处，ParameterMirror属于。
   * MethodMirror管理.
   */
  public setMirror<T extends MethodMirror | PropertyMirror>(
    mirrorKey: string | symbol,
    mirror: T,
    isStatic = false
  ): void {
    if (isStatic) {
      this.staticMembers.set(mirrorKey, mirror);
    } else {
      this.instanceMembers.set(mirrorKey, mirror);
    }
  }
}

export type ClassDecorateFactory<T extends ClassDecorate> = <
  TFunction extends Function
>(
  target: TFunction
) => T;
