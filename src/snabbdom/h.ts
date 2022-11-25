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

    let data: any = undefined
    let text: any = undefined
    let children = undefined
    let elm = undefined
    let key = undefined

    if (argLen == 2) {
        if (typeof b === 'object') children = b
        else text = b

    } else if (argLen == 3) {
        if (typeof c === 'object') children = c
        else text = c
        data = b

    }
    return vNode(elType, data, text, children, key, elm)
}