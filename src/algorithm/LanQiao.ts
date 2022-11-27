/*
  @description  输入两个数字支付穿串，分别按照数学形式相加，进制开始位由低位决定依次累加
               并返回最终运算结果
  @example
        3 3 2 1 1
          3 2 2 1
restult 4 2 1 1 0
  @understand 进制范围2-10 进制开始值由最低进制决定，依次累加
*/

export default function () {
    function calculate(a: string, b: string) {
        let aLast = a.length - 1
        let bLast = b.length - 1
        let res = ''
        let n = 0
        let forward: number = parseInt(a.charAt(aLast)) + parseInt(b.charAt(bLast))
        if (forward > 10) forward = 10
        if (forward < 2) forward = 2


        while (true) {

            let sum = (parseInt(a.charAt(aLast)) + parseInt(b.charAt(bLast)) + n) % forward


            let stepSign = parseInt((parseInt(a.charAt(aLast)) + parseInt(b.charAt(bLast) + n) / forward).toFixed(0))


            res += sum
            if (aLast == 0 && bLast == 0) return res


            if (aLast > 0) aLast--
            if (bLast > 0) bLast--
            forward++
            n = stepSign
            if (forward > 10) forward = 10
        }
    }

    function reverse(str: string) {
        let res = ''
        let point = str.length - 1
        while (point > 0) res += str.charAt(point)
        return res
    }

    console.log('final', reverse(calculate('33211', '3221')));
}