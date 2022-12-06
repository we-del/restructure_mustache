/* 
 * 2022/12/6 15:26
 * author: xxx
 * @description:
 */

import reactive from "@/reactive/reactive";

export default function () {

    const obj: any = {}
    reactive(obj, 'a', 1)

    obj.a = 2
    console.log(obj.a)

    const btn: any = document.querySelector('button')
    const origin: any = document.querySelector('#origin')
    btn.onclick = () => {
        obj.a = Math.round(Math.random() * 20)
        origin.innerHTML = obj.a
    }
    origin.innerHTML = obj.a
}