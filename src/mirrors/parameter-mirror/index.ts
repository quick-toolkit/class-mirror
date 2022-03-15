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
import { MethodMirror } from '../method-mirror';
import { ParameterDecorate } from '../../decorates';

/**
 * 参数装饰器映射
 * @class ParameterMirror
 */
export class ParameterMirror<
  T extends ParameterDecorate = any
> extends DeclarationMirror<T> {
  /**
   * 创建装饰器
   * @param metadata 元数据对象
   * 创建一个参数装饰器， metadata 必须继承至 ParameterMetadata 类.
   */
  public static createDecorator(
    metadata: ParameterDecorate
  ): ParameterDecorator {
    return (
      target: Object,
      propertyKey: string | symbol,
      parameterIndex: number
    ): void => {
      // There is no propertyKey when the parameter decorator is used on the constructor.
      const isConstructor = !propertyKey;

      if (isConstructor) {
        const classMirror = ClassMirror.reflect(target as Function);
        classMirror.target = target;

        const parameterMirror = new ParameterMirror();

        parameterMirror.classMirror = classMirror;
        parameterMirror.index = parameterIndex;
        parameterMirror.target = target;
        parameterMirror.propertyKey = null;
        parameterMirror.methodMirror = null;

        parameterMirror.metadata.add(metadata);
        classMirror.setParameter(parameterIndex, parameterMirror);

        // 定义类元数据
        Reflect.defineMetadata(ClassMirror, classMirror, target);
        // 定义方法元数据
        Reflect.defineMetadata(
          ParameterMirror,
          parameterMirror,
          target,
          parameterIndex.toString()
        );
        return;
      }

      const isStatic: boolean = ClassMirror.isStaticMember(target, propertyKey);

      const classMirror = ClassMirror.reflect(
        isStatic || isConstructor ? (target as Function) : target.constructor
      );

      classMirror.target =
        isStatic || isConstructor ? target : target.constructor;

      const methodMirror =
        classMirror.getMirror<MethodMirror>(propertyKey, isStatic) ||
        new MethodMirror();

      if (!methodMirror.descriptor && !methodMirror.propertyKey) {
        methodMirror.propertyKey = propertyKey;
        methodMirror.isStatic = isStatic;
        methodMirror.classMirror = classMirror;
        methodMirror.target = target;
        methodMirror.descriptor = Object.getOwnPropertyDescriptor(
          target,
          propertyKey
        );
      }

      // 查找参数
      const parameterMirror =
        methodMirror.getParameter(parameterIndex) || new ParameterMirror();

      // 元数据关联
      metadata.target = target;
      metadata.classMirror = classMirror;
      metadata.methodMirror = methodMirror;
      metadata.propertyKey = propertyKey;
      metadata.index = parameterIndex;

      // 添加元数据
      parameterMirror.metadata.add(metadata);

      // 设置基本信息
      parameterMirror.target = target;
      parameterMirror.propertyKey = propertyKey;
      parameterMirror.index = parameterIndex;
      parameterMirror.classMirror = classMirror;
      parameterMirror.methodMirror = methodMirror;

      // 设置参数
      methodMirror.setParameter(parameterIndex, parameterMirror);

      // 设置方法映射
      classMirror.setMirror(propertyKey, methodMirror, isStatic);

      // 定义方法元数据
      Reflect.defineMetadata(MethodMirror, methodMirror, target, propertyKey);

      // 定义类元数据
      Reflect.defineMetadata(
        ClassMirror,
        classMirror,
        isStatic ? target : target.constructor
      );
    };
  }

  /**
   * 使用函数名称查找映射数据
   * @param type
   * @param method
   * @param index
   * @param isStatic
   *
   *  使用此方法可以目标类上的函数所映射的ParameterMirror实例.
   */
  public static reflect<T extends Function>(
    type: T,
    method: string | symbol,
    index: number,
    isStatic?: boolean
  ): ParameterMirror | undefined;
  /**
   * @deprecated
   * 使用函数查找映射数据
   * @param type
   * @param method
   * @param index
   * @param isStatic
   *
   * 使用此方法可以目标类上的函数所映射的ParameterMirror实例.
   */
  public static reflect<T extends Function>(
    type: T,
    method: (...args: any[]) => any,
    index: number,
    isStatic?: boolean
  ): ParameterMirror | undefined;
  /**
   * 实现方法
   * @param type
   * @param method
   * @param index
   * @param isStatic
   */
  public static reflect<T extends Function>(
    type: T,
    method: any,
    index: number,
    isStatic?: boolean
  ): ParameterMirror | undefined {
    const methodMirror = MethodMirror.reflect(type, method, isStatic);
    if (methodMirror) {
      return methodMirror.getParameter(index);
    }
  }

  /**
   * 映射构造函数参数
   * @param type
   * @param index
   */
  public static reflectConstructor<
    P extends ParameterMirror,
    T extends Function = Function
  >(type: T, index: number): P | undefined {
    return Reflect.getMetadata(ParameterMirror, type, index.toString()) as P;
  }

  /**
   * methodMirror
   * 当前参数所属MethodMirror
   * 如果是构造函数的参数装饰器 则为null
   */
  public methodMirror: MethodMirror | null;

  /**
   * classMirror
   * 当前参数所属ClassMirror
   */
  public classMirror: ClassMirror;

  /**
   * propertyKey
   * 当前参数的key名称
   * 如果是构造函数的参数装饰器 则为null
   */
  public propertyKey: string | symbol | null;

  /**
   * index
   * 当前参数的下标
   */
  public index: number;

  /**
   * 获取当前参数的类型
   * 如果该参数没有类型则返回undefined.
   */
  public getDesignParamType(): Function | undefined {
    if (this.methodMirror) {
      return this.methodMirror.getDesignParamTypes()[this.index];
    } else {
      return this.classMirror.getDesignParamTypes()[this.index];
    }
  }
}
