import {h} from '@/snabbdom/h'
import {patch} from '@/snabbdom/patch'

// import {h, init} from 'snabbdom'

export default function () {
    const container = document.querySelector('#container')

    // 例子1通过
    // const vNode = patch(container, h('div', {style: 'font-size:20px'},
    //     [
    //         h('span', { key: '1'}, '我来了1'),
    //         h('span',  '我来了2'),
    //         h('span', { key: '2'}, '我来了3'),
    //         h('span',  '我来了4'),
    //     ])
    // )

    // 例子2 一对多 通过
    // const vNode = patch(container, h('div',h('h1','我来啦')))

    // 例子3 多对一
    // const vNode = patch(container, h('div', [
    //     h('h2', '我来啦3'),
    //     h('div', '我来啦4'),
    //     h('p', '我来啦5'),
    // ]))


    const vNode = patch(container, h('div', '我是内容1'))
    console.log('@before', vNode)
    const btnNode: any = document.querySelector('button')
    btnNode.onclick = () => {

        // 例子1通过 多对多
        // const newNode = patch(vNode, h('div',
        //     [
        //         h('div',  '我是新节点'),
        //         h('span', { key: '2'}, '我来了3'),
        //         h('span', {key: '1'}, '我来了1'),
        //         h('span',  '我来了4'),
        //     ]))

        // 例子2通过 一对多
        // const newNode = patch(vNode, h('div',
        //     [
        //         h('div','我来啦'),
        //         h('h2','我来啦'),
        //         h('h3','我来啦'),
        //     ]))
        // 例子3通过 多对一
        // const newNode = patch(vNode, h('div',
        //     h('div', '我来啦')))
        const newNode = patch(vNode, h('div',
          [
              h('span','我来'),
              h('h1','hello'),
              h('h1',' world!')
          ]))
        console.log('@res', newNode)
    }


    // snaabdomJest()
}


// function snaabdomJest() {
//
//
//     let patch = init([])
//
//     let vnode = h('div',[
//         h('h1', 'Hello Snabbdom'),
//         h('h2', 'Hello h2'),
//         h('span', 'Hello s2'),
//     ])
//
//     let container = document.querySelector('#container')
//     let oldVnode: any
//     setTimeout(() => {
//         // @ts-ignore
//         oldVnode = patch(container, vnode)//更新vnode
//         console.log('@first patch', oldVnode)
//     }, 2)
//
//     const btnNode: any = document.querySelector('button')
//     btnNode.onclick = () => {
//         // vnode = h('div', [
//         //
//         //     h('h1', {key: 1}, 'Hello World'),
//         //     h('h2', {key: 2}, 'Hello h2'),
//         //     //@ts-ignore
//         //     h('h1', {style: 'color:pink'}, 'Hello Snabbdom'),
//         //     h('p', {key: 3}, 'Hello P'),
//         // ])
//         vnode = h('div', 'hello')
//         console.log('@finalPatch', patch(oldVnode, vnode));
//     }
// }