/* 
 * 2022/11/15 17:32
 * author: xxx
 * @description:
 */

import {vNode, VNode} from './vnode'


export function h(elType: string): VNode;
// export function h(elType: string, data: { [props: string]: any }): VNode;
export function h(elType: string, data: any): VNode;
export function h(elType: string, data: any, children: any): VNode;
export function h(elType: string, b?: any, c?: any): VNode {
    const argLen = arguments.length

    let data: any = ''
    let text: any = ''
    let children: any = ''
    let elm = ''
    let key = ''

    if (argLen == 2) {
        if (typeof b === 'object') {
            if (Array.isArray(b)) {

                children = b
            } else {
                children = [b]
            }

        } else text = b

    } else if (argLen == 3) {
        if (typeof c === 'object') {
            if (Array.isArray(c)) {
                children = c
            } else {
                children = [c]
            }
        } else text = c
        if (Reflect.has(b, 'key')) {
            key = b.key
            Reflect.deleteProperty(b, 'key')
        }
        data = b


    }
    return vNode(elType, data, text, children, key, elm)
}