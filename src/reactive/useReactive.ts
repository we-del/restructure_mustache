/* 
 * 2022/12/6 15:26
 * author: xxx
 * @description:
 */

import observe from "@/reactive/observe";

export default function () {

    const obj: any = {
        a: {
            b: {
                c: 1
            }
        },
        arr: [1, 2, 3]
    }
    observe(obj)

    obj.a = 2
    console.log(obj.a)

    const btn: any = document.querySelector('button')
    const origin: any = document.querySelector('#origin')
    btn.onclick = () => {
        obj.a = Math.round(Math.random() * 20)
        origin.innerHTML = obj.a
    }
    origin.innerHTML = obj.a
    console.log(obj)
}