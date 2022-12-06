/* 
 * 2022/12/6 17:29
 * author: xxx
 * @description:
 */

export default function def(o: any, k: any, value: any) {
    Reflect.defineProperty(o, k, {
        enumerable: false,
        writable: true,
        value,
        configurable: true
    })
}