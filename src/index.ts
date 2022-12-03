/* 
 * 2022/11/14 9:46
 * author: xxx
 * @description: 完成MyMustache封装
 */

import useMustache from '@/mustache/useMustache'
import leetCode10 from "@/algorithm/leetCode10";
import useSnabbdom from "@/snabbdom/useSnabbdom";
import useAST from "@/AST/useAST";
// import LanQiao from '@/algorithm/LanQiao'

useAST()
// useMustache()
// useSnabbdom()

// leetCode10()


function convert(arr: any) {
    if (!Array.isArray(arr)) console.log('需要传入数组')

    const res: any = {children: []}
    arr.forEach((val: any) => {
        if (typeof val == 'object') {
            res.children.push(convert(val))
        } else {
            res.children.push({value: val})
        }
    })

    return res
}

// console.log(convert([1, 2, [3, [4, 5], 6], 7, [8], 9]));
// console.log(JSON.stringify(convert([1, 2, [3, [4, 5], 6], 7, [8], 9])));


/*
  @description 只能匹配对当前的[]部分进行解耦 ，如 2[abc] 结果为 abcabc ; 1[a2[b]] 结果为：abb
*/
function smartRepeat(target: string) {
    const regMore = /(\d+)\[(.*)\]/g
    const pattern: any = regMore.exec(target)
    if (!pattern) {
        console.log('输入不合法，正确输入格式为1[abc] 重复次数[重复内容]')
        return
    }

    const step = pattern[1]
    const str = pattern[2]

    function process(step: number, str: string) {
        let res = ''

        let point = 0
        for (let i = 0; i < step; i++) {
            point = 0
            while (point < str.length) {
                const moveStr = str.substring(point)
                const reg = shouldDeep(moveStr)
                const arr = moveStr.matchAll(reg).next().value
                console.log('@pattern', arr, moveStr)
                if (arr && arr.length > 0) {
                    arr.map((t: any) => {
                        point += t.length
                        return smartRepeat(t)
                    }).forEach((s: any) => {
                        console.log('@@sss', s)
                        res += s
                    })
                } else {
                    res += str.charAt(point)
                    point++
                }
            }

        }
        return res
    }

    function shouldDeep(str: string) {
        const regLess = /^\d+\[.*?\]/g
        const regMore = /^\d+\[.*\]/g

        let flag = false

        // 需要提前探底，来决定是否深浅匹配，对当前字串进行一次遍历，如果只包含一个 [ 旧浅匹配，如果包含多个就深匹配
        // 以 [ 开始 以 ] 结尾查看个数，来决定是否深度匹配
        let count = 0
        for (let i = 0; i < str.length; i++) {
            if (str[i] == '[') count++
            if (str[i] == ']') break

        }
        flag = count > 1
        return flag ? regMore : regLess
    }

    return process(step, str)
}

// console.log(smartRepeat('2[a2[bc2[e]]]'));


function smartRepeatStack(target: string) {
    let point = 0
    let stackNum = []
    let stackRes: any = []
    let num = ''
    let substr = ''
    while (point < target.length) {
        let char: any = target[point]
        if (parseInt(char)) {
            // 处理符号栈
            if (substr) {
                stackRes.push(substr)
                substr = ''
            }
            // 数字
            num += char
        } else {
            // 字符
            // 数栈归位
            if (char == '[') {
                if (substr) {
                    stackRes.push(substr)
                    substr = ''
                }
                // 收集当前数到数栈
                stackNum.push(parseInt(num))
                num = ''
            } else if (char == ']') {

                const step: any = stackNum.pop()
                let res = ''

                // 如果只出现了]说明是合并操作，如果连续出现两个]] 说明是遍历后覆盖操作
                if (point + 1 == target.length) {
                    stackRes.forEach((n: any) => res += n)
                    while (stackRes.length > 0) stackRes.pop()
                    stackRes.push('')
                    for (let i = 0; i < step; i++) {
                        stackRes[0] += res
                    }
                } else if (target[point - 1] == ']') {
                    // 合并字符操作
                    let val = stackRes.pop()
                    for (let i = 0; i < step; i++) {
                        res += val
                    }
                    stackRes.push(res)
                } else {
                    // 第一次]合并前一个字符
                    for (let i = 0; i < step; i++) {
                        res += substr
                    }
                    stackRes[stackRes.length - 1] = stackRes[stackRes.length - 1] + res
                }
                substr = ''

            } else {
                substr += char
            }
        }
        point++
    }
    console.log(stackRes)
}

// console.log(smartRepeatStack('2[a2[bc2[e]]]'));


