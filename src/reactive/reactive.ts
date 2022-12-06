/* 
 * 2022/12/6 15:24
 * author: xxx
 * @description:
 */
import observe from "@/reactive/observe";

/**
 @description 创建响应属性，由于defineProperty全局监听，因此形成闭包，代理的是第三个形参val属性
 @possible 当向响应对象下新增属性时无法监听(因为只能对defineProperty属性进行监听)，数组的响应挂载？
 */
export default function reactive(data: any, key: string, val: any) {

    // 进行递归响应式挂载(如果是复杂数据类型则会在此挂载)
    observe(data[key])
    // 向data对象中挂载一个响应属性，当该属性被使用时get方法调用，当值被修改时set方法调用(并全局监听此变化)
    Reflect.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        get(): any {
            console.log(`得到了数据${val}`)
            return val
        },
        set(v: any) {
            val = v
            // 对新数据进行响应式在挂载(防止是对象的情况)
            observe(v)
            console.log('修改了新的数据val')
        }
    })
}