import {createElement} from '@/snabbdom/createElement'
import {vNode} from '@/snabbdom/vnode'

export function patch(oldVNode: any, newVNode: any) {
    if (!oldVNode || !newVNode) {
        console.log('参数不能为空 ')
        return
    }
    // 第一次上树
    if (oldVNode instanceof Element) {
        return initTreeMount(oldVNode, newVNode)
    } else {
        return compareVNode(oldVNode, newVNode)
    }
}


/*
  @description 完成初始化dom挂载
  @param
*/
function initTreeMount(oldVNode: any, newVNode: any) {
    // 完成dom挂载
    oldVNode.appendChild(createElement(newVNode))
    const mainNode = oldVNode
    // 转换为虚拟dom,完成虚拟dom树挂载
    oldVNode = vNode(oldVNode.localName, {id: 'container'}, '', '', '', '')
    oldVNode.children = newVNode
    oldVNode.elm = mainNode
    return oldVNode
}

/*
  @description 进行前后虚拟dom对比
*/
function compareVNode(oldVNode: any, newVNode: any) {
    // 拿到插入节点后的第一个节点
    let preNode = oldVNode
    let patchNode = oldVNode.children
    let compareVNode = newVNode
    console.log('@compare', patchNode, compareVNode)
    while (!!compareVNode) {
        // 判断是数组还是对象
        if (Array.isArray(compareVNode) || Array.isArray(patchNode)) {

            // 认定所有子节点都是数组形式
            console.log('@isArr', compareVNode)
            console.log('@isArr', patchNode)

            handleAssociateDiff(patchNode, compareVNode, preNode)
            // 遍历每个新节点中的元素 ，查看其在老节点中是否存在
            // if (Array.isArray(patchNode) && Array.isArray(compareVNode)) {
            //     console.log('数组双向对比同节点')
            //     handleAssociateDiff(patchNode, compareVNode, preNode)
            // } else if (Array.isArray(compareVNode)) {
            //     console.log('新节点是数组，老节点不是数组')
            //     handleAddDiff(patchNode, compareVNode, preNode)
            // } else if (Array.isArray(patchNode)) {
            //     console.log('老节点是数组，新节点不是数组')
            //     handleSubDiff(patchNode, compareVNode, preNode)
            // }

        } else {
            console.log('@textDiff')
            // 相同父节点和key可进行深度比较
            if (patchNode.key != compareVNode.key
                || patchNode.sel != compareVNode.sel
                || typeof patchNode.children != typeof compareVNode.children
            ) {
                treeReMount(preNode, compareVNode)
                break
            } else {
                shouldSameVNode(patchNode, compareVNode)
            }
        }


        patchNode = patchNode.children
        compareVNode = compareVNode.children
        preNode = preNode.children
    }
    return oldVNode
}

/*
  @description 处理相同节点
*/
function shouldSameVNode(oldVNode: any, newVNode: any) {
    let flag = false
    console.log('showldSame', oldVNode, newVNode)
    if (oldVNode.key == newVNode.key && oldVNode.sel == newVNode.sel) {
        if (oldVNode.text != newVNode.text) {
            oldVNode.elm.innerText = newVNode.text
        }
        flag = true
    }

    return flag;
}

/*
  @description 前后不同的节点重新挂载节点
  @param oldVNode 待插入节点位置的父节点
  @param newVNode 新插入的虚拟dom系欸点
*/
function treeReMount(oldTreeFatherVNode: any, newVNode: any) {
    console.log('remount')
    // 删除旧dom树上的子节点
    oldTreeFatherVNode.children.elm.remove()
    // 新增新dom子节点
    oldTreeFatherVNode.elm.appendChild(createElement(newVNode))
    oldTreeFatherVNode.children = newVNode
}


/*
  @description 处理新增变化diff(新节点是数组(同时旧节点不是数组))
  @param patchNode 旧树上的对比节点
  @param compareVNode 新树上的对比节点
  @param preNode 当前节点上的父节点(用于重置当前节点的指向(以及卸载节点))
*/
function handleAddDiff(patchNode: any, compareVNode: any, preNode: any) {
    let left = 0
    let right = compareVNode.length - 1
    // 找到插入节点索引，并将值渲染到节点上，
    // 之后索引前的数据插入到其前，索引后的数据插入到其后
    while (left >= right) {
        if (shouldSameVNode(patchNode, compareVNode[left])) {
            right = -1
            break
        }
        if (shouldSameVNode(patchNode, compareVNode[right])) {
            left = -1
            break
        }
        left++
        right--
    }
    // 老虚拟dom中没有可复用的节点
    if (left >= right) {
        // vNode实例
        console.log('重新挂载虚拟dom')
    } else if (right == -1) {
        // left索引的节点是可复用的
        console.log('left复用')
    } else if (left == -1) {
        console.log('right复用')
        // right索引的节点是可复用的
    }
}

/*
  @description 处理对比节点都是数组的情况，需要进行差异比较
  @param patchNode 旧树上的对比节点
  @param compareVNode 新树上的对比节点
  @param preNode 当前节点上的父节点(用于重置当前节点的指向(以及卸载节点))
*/
function handleAssociateDiff(patchNode: any, compareVNode: any, preNode: any) {
    // 使用双指针进行比较

    let oldPoint = 0 // 依次遍历旧节点，寻找其在新节点中可复用的节点
    let reuseNode = new Map() // key(新索引) -> value(旧索引)
    while (oldPoint < patchNode.length) {
        let left = 0
        let right = compareVNode.length - 1
        while (left <= right) {
            if (shouldSameVNode(patchNode[oldPoint], compareVNode[left])
                && !reuseNode.has(left)) {
                reuseNode.set(left, oldPoint)
                break
            } else if (shouldSameVNode(patchNode[oldPoint], compareVNode[right])
                && !reuseNode.has(right)) {
                reuseNode.set(right, oldPoint)
                break
            }

            left++
            right--
        }
        oldPoint++
    }
    const reserveNode = diffReserveNode(patchNode, reuseNode)

    // 使用insertBefore完成节点挂载
    // 对比两个map的不同点,根据新节点的列表,完成新节点的插入(不包括可复用节点)
    mergeVNode(compareVNode, preNode, reserveNode, reuseNode)


}

/*
  @description 处理新增变化diff(新节点非数组情况(同时旧节点是数组))
  @param patchNode 旧树上的对比节点
  @param compareVNode 新树上的对比节点
  @param preNode 当前节点上的父节点(用于重置当前节点的指向(以及卸载节点))
*/
function handleSubDiff(patchNode: any, compareVNode: any, preNode: any) {

}


/*
  @description 用于进行可复用dom的对比，并卸载不可复用的节点
  @param patchNode 旧树上的对比节点
  @param reuseNode 已对比出来的可复用节点(map结构)
  @return 返回可以复用的节点和原来的索引(map结构)
*/
function diffReserveNode(patchNode: any, reuseNode: any) {
    // 此时map中都是可以复用的节点，除此以外为不能复用的节点
    // 开始重新挂载节点（将不能复用的节点移除然后重新挂载新节点）
    // 将不包含在索引上的节点删除
    // 删除差异化dom节点，然后将新节点放到合适位置
    // 只需关注卸载旧dom节点即可，后续节点会自动补齐，然后挂载到父节点上

    const mergeNode = new Map()

    // 找出所有可以复用的节点，放到一个map里(保留老位置和数据)
    reuseNode.forEach((val: any, key: any) => {
        for (let i = 0; i < patchNode.length; i++) {
            if (i == val) {
                mergeNode.set(i, patchNode[i])
                break
            }
        }
    })

    //  找出所有不可复用的节点进行卸载
    for (let i = 0; i < patchNode.length; i++) {
        let isExit = false
        mergeNode.forEach((val, key) => {
            if (i == key) {
                isExit = true
            }
        })
        if (!isExit) {
            // 移除不可复用的dom节点
            patchNode[i].elm.remove()
        }
    }
    return mergeNode
}


/*
  @description 完成节点合并和页面挂载
  @param newVNode 新的虚拟dom节点
  @param FatherNode 准备合并节点的父节点对象
  @param reserveNode 旧节点可复用节点的索引部分(map结构 , key(旧索引) -> val(vNode))
  @param reuseNode 新旧节点相同节点复用的索引部分(map结构，key(新节点索引) -> val(旧节点索引))
  @tip Node.appendChild(Node) 可以将当前位置的元素添加到父节点的末尾，如果此节点以存在则会移动节点位置
*/
function mergeVNode(newVNode: any, fatherNode: any, reserveNode: any, reuseNode: any) {

    // 使用insertBefore完成节点挂载
    // 对比两个map的不同点,根据新节点的列表,完成新节点的插入(不包括可复用节点)
    // 有可复用的节点

    const finalVNode = []
    const reuseNodeTmp = new Map()
    // 找到不能复用的节点
    reuseNode.forEach((val: any, key: any) => {
        for (let i = 0; i < newVNode.length; i++) {
            if (key == i) {
                reuseNodeTmp.set(i, reuseNode[i])
            }
        }
    })

    // 将可复用节点插入到最终的数组中
    //  找出所有不可复用的节点进行卸载
    for (let i = 0; i < newVNode.length; i++) {
        let isReuse = false
        reuseNodeTmp.forEach((val, key) => {
            if (i == key) {
                isReuse = true
            }
        })

        // 没有对应的复用节点
        if (!isReuse) {
            // 移除不可复用的dom节点
            finalVNode.push(newVNode[i])
        } else {
            // 找到可复用节点插入位置
            reuseNode.forEach((val: any, key: any) => {
                if (key == i) {
                    finalVNode.push(reserveNode.get(val))
                }
            })
        }
    }

    // 按顺序进行创建节点，然后挂载到到新VNode上
    console.log('@finalVNode插入节点展示', finalVNode)
    finalVNode.forEach((vNode) => {
        if (!vNode.elm) {
            vNode.elm = createElement(vNode)
        }
        fatherNode.elm.appendChild(vNode.elm)
    })
    fatherNode.children = finalVNode
}
