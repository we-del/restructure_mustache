/* 
 * 2022/11/15 16:59
 * author: xxx
 * @description:
 */

export type VNode = {
    elm: string | undefined
    data: { [props: string]: any } | undefined
    sel: string | undefined
    key: any
    text: string | undefined
    children: any[]

}


export function vNode(
    sel: any, data: any, text: any, children: any, key: any, elm: any
): VNode {
    return {sel, data, text, children, key, elm}
}