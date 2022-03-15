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

import { DeclarationMetadata } from '../../metadatas';
import { ClassConstructor } from '../../interfaces';

/**
 * @class DeclarationMirror
 */
export abstract class DeclarationMirror<T extends DeclarationMetadata = any> {
  /**
   * metadata collection
   * 元数据集合
   */
  public readonly metadata: Set<T> = new Set();

  /**
   * target
   * Mirror映射的目标
   */
  public target: Object;

  /**
   * 获取元数据集合 不包含父类
   * @param type 类型, 参数继承至 `MethodMetadata`。
   */
  public getMetadata<M extends T = T>(type?: ClassConstructor<M>): M[] {
    const metadataList = Array.from<any>(this.metadata.values());
    if (type) {
      return metadataList.filter((o) => o instanceof type) as M[];
    }
    return metadataList as M[];
  }
}
