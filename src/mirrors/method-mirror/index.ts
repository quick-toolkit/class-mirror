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
import { ClassMirror } from '../class-mirror';
import { MethodDecorate, ParameterDecorate } from '../../decorates';
import { ParameterMirror } from '../parameter-mirror';
import { ClassConstructor } from '../../interfaces';

/**
 * @class MethodMirror
 * 方法反射
 */
export class MethodMirror<
  T extends MethodDecorate = any,
  D = any
> extends DeclarationMirror<T> {
  /**
   * 创建方法装饰器
   * @param decorate
   * 使用此方法可以创建一个成员方法装饰器, metadata 必须继承至MethodDecorate对象
   */
  public static createDecorator(
    decorate: MethodDecorate | MethodDecorateFactory<MethodDecorate>
  ): MethodDecorator {
    return <T>(
      target: Object,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<T>
    ): TypedPropertyDescriptor<T> => {
      // 是类
      const isStatic: boolean = ClassMirror.isStaticMember(target);
      const classMirror = ClassMirror.reflect(
        isStatic ? (target as Function) : target.constructor
      );

      classMirror.target = isStatic ? target : target.constructor;

      // 获取 MethodMirror
      const methodMirror =
        classMirror.getMirror<MethodMirror>(propertyKey, isStatic) ||
        new MethodMirror();

      // 设置基本属性
      methodMirror.isStatic = isStatic;
      methodMirror.classMirror = classMirror;
      methodMirror.propertyKey = propertyKey;
      methodMirror.descriptor = descriptor;
      methodMirror.target = target;

      if (typeof decorate === 'function') {
        decorate = decorate(classMirror.target, propertyKey, descriptor);
      }

      // metadata信息设置
      decorate.classMirror = classMirror;
      decorate.propertyKey = propertyKey;
      decorate.descriptor = descriptor;
      decorate.target = target;

      // 反向映射元数据至 MethodMirror
      Reflect.defineMetadata(
        decorate,
        methodMirror,
        isStatic ? target : target.constructor
      );

      // 设置元数据
      methodMirror.decorates.add(decorate);

      // 添加mirror
      classMirror.setMirror(propertyKey, methodMirror, isStatic);

      // 定义类元数据
      Reflect.defineMetadata(
        ClassMirror,
        classMirror,
        isStatic ? target : target.constructor
      );

      // 定义 MethodMirror 元数据
      Reflect.defineMetadata(MethodMirror, methodMirror, target, propertyKey);

      // 定义函数名称元数据
      Reflect.defineMetadata(descriptor.value, methodMirror, target);

      return descriptor;
    };
  }

  /**
   * 使用函数名称查找映射数据
   * @param type
   * @param method
   * @param isStatic
   */
  public static reflect<T extends Function>(
    type: T,
    method: string | symbol,
    isStatic?: boolean
  ): MethodMirror | undefined;
  /**
   * 使用函数查找映射数据
   * @param type
   * @param method
   * @param isStatic
   *
   * 使用此方法可以目标类上的函数所映射的MethodMirror实例 具体使用方法请查阅test/index.spec.ts文件.
   */
  public static reflect<T extends Function>(
    type: T,
    method: (...args: any[]) => any,
    isStatic?: boolean
  ): MethodMirror | undefined;
  /**
   * 实现方法
   * @param type
   * @param method
   * @param isStatic
   */
  public static reflect<T extends Function>(
    type: T,
    method: unknown,
    isStatic?: boolean
  ): MethodMirror | undefined {
    if (typeof method === 'string' || typeof method === 'symbol') {
      return Reflect.getMetadata(
        MethodMirror,
        isStatic ? type : type.prototype,
        method
      ) as MethodMirror;
    }

    return Reflect.getMetadata(
      method,
      isStatic ? type : type.prototype
    ) as MethodMirror;
  }

  /**
   * classMirror
   * 当前Mirror所属的ClassMirror
   */
  public classMirror: ClassMirror;

  /**
   * propertyKey
   * 当前Mirror所属target成员上的key名称
   */
  public propertyKey: string | symbol;

  /**
   * parameters
   * 当前Mirror的所有参数ParameterMirror集合
   */
  private readonly parameters: Map<number, ParameterMirror> = new Map();

  /**
   * descriptor
   * 当前参数的 descriptor
   */
  public descriptor: D;

  /**
   * isStatic
   * 是否为静态成员
   */
  public isStatic: boolean;

  /**
   * 获取所有元数据 包含父类
   * @param type 类型, 参数继承至 `MethodMetadata`。
   */
  public getAllDecorates<M extends T = T>(type?: ClassConstructor<M>): M[] {
    if (this.isStatic) {
      return this.getDecorates(type);
    }
    const list: M[] = [];
    this.classMirror
      .getAllMirrors<MethodMirror<M>>(MethodMirror)
      .forEach((o) => {
        if (o.propertyKey === this.propertyKey) {
          const metadata = o.getDecorates(type);
          list.push(...metadata);
        }
      });
    return list;
  }

  /**
   * 获取所有参数装饰器
   */
  public getParameters(): Map<number, ParameterMirror> {
    return new Map(this.parameters.entries());
  }

  /**
   * 获取指定位置的参数装饰器反射, 不包含父类（基类）.
   * @param index 装饰器位置
   */
  public getParameter<T extends ParameterDecorate = ParameterDecorate>(
    index: number
  ): ParameterMirror<T> {
    return this.parameters.get(index) as ParameterMirror<T>;
  }

  /**
   * 设置指定位置的参数装饰器反射, 不包含父类（基类）.
   * @param index
   * @param mirror
   */
  public setParameter<T extends ParameterMirror>(
    index: number,
    mirror: T
  ): Map<number, ParameterMirror> {
    return this.parameters.set(index, mirror);
  }

  /**
   * 获取参数的类型映射列表
   * 包含该函数上的所有参数
   * 返回数组的下标 对应ParameterMirror的index属性
   */
  public getDesignParamTypes(): Function[] {
    return Reflect.getMetadata(
      'design:paramtypes',
      this.target,
      this.propertyKey
    ) as Function[];
  }

  /**
   * 获取返回类型
   */
  public getReturnType(): Function | undefined {
    return Reflect.getMetadata(
      'design:returntype',
      this.target,
      this.propertyKey
    ) as Function;
  }
}

export type MethodDecorateFactory<T extends MethodDecorate> = (
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<any>
) => T;
