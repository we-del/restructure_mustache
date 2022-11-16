/* 
 * 2022/11/15 17:32
 * author: xxx
 * @description:
 */

import {vNode, VNode} from './vnode'


export function h(elType: string): VNode;
export function h(elType: string, data: { [props: string]: any }): VNode;
export function h(elType: string, data: any[]): VNode;
export function h(elType: string, data: { [props: string]: any }, children: any[]): VNode;
export function h(elType: string, b?: any, c?: any): VNode {

    let data = undefined
    let text = undefined
    let children = undefined
    let elm = undefined
    let key = undefined
    children = c
    return vNode(elType, data, text, children, key, elm)
}