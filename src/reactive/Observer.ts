/* 
 * 2022/12/6 17:27
 * author: xxx
 * @description:
 */
import def from "@/reactive/def";
import reactive from "@/reactive/reactive";

/**
 @description 用于标记对象下的数据是否是响应式的
 */
export default class Observer {
    constructor(data: any) {
        // 添加响应式标记
        def(data, '__ob__', this)
        // 将该对象下所有属性进行响应式包装
        this.walk(data)
    }

    walk(data: any) {
        for (const k in data) {
            reactive(data, k, data[k])
        }
    }
}