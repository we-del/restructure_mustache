/* 
 * 2022/12/6 17:28
 * author: xxx
 * @description:
 */
import Observer from "@/reactive/Observer";

/**
 @description 递归响应监听的入口
 */
export default function observe(val: any) {
    if (typeof val !== 'object') return
    let ob: any
    if (Reflect.has(val, '__ob__')) {
        ob = val.__ob__
    } else {
        ob = new Observer(val)
    }
    return ob
}