/* 
 * 2022/11/14 9:46
 * author: xxx
 * @description: 完成MyMustache封装
 */

import useMustache from '@/mustache/useMustache'
import leetCode10 from "@/algorithm/leetCode10";
import {h} from '@/snabbdom/h'

console.log(h('div', {name: '张三'},
    h('div',
        [
            h('span', {style: 'color:white'}, '我来了1'),
            h('span', {style: 'color:red'}, '我来了2'),
            h('span', {style: 'color:blue'}, '我来了3'),
            h('span', {style: 'color:pink'}, '我来了4'),
        ]
    ))
)
useMustache()

leetCode10()