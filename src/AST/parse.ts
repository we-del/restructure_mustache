export default function (template: string) {
    const regTagOpen = /^<(.*?)\s*?>/
    const regTagClose = /^<\/(.*?)\s*?>/
    const regContent = /^>(.*?)</
    const tagStack = []

    const originCode: any = document.querySelector('#origin')
    const resultCode: any = document.querySelector('#result')
    originCode.innerText = template
    template = clearSpace(template)


    // 查找路径的唯一标识
    let tid = 0

    // 遍历字符串的指针
    let point = 0
    const templateLen = template.length

    /*
      @description astTree数据结构
        {
            tag: string
            attrs: [[props:string]:any]
            type: number (标签为1，text为3)
            children: 子节点
        }
       @strategy
       匹配到的开合标签入栈，当匹配到闭合标签对应的前一个标签出栈;
       在匹配到一个开合标签时，如标签栈不为空则挂载到其节点的children下 ；

       @bug
         存在一个同路径相同标签情况，导致寻找到了错误的父节点，需要解决
         解决了此bug但未完全解决，相同路径标签的情况下无法正确的匹配对应标签位置，需要一个标识
    */
    let astTree: any = []
    while (point < templateLen) {


        const curTemplatePlace = template.substring(point)

        // 匹配到了内容
        if (regContent.test(curTemplatePlace)) {
            const match: any = regContent.exec(curTemplatePlace)
            console.log('匹配到了内容', regContent.exec(curTemplatePlace));
            const matchLen = match[1].length

            // 没有找到节点 （匹配到 >< 这种情况）
            if (matchLen == 0) point += 1
            else {
                point += match[1].length
                const text = match[1].trim()
                // 过滤空白文本节点
                if (text) insertTreeNodeToAST('', '', astTree, tagStack, text)
            }
            continue
        }

        // 匹配到了闭合标签
        if (regTagClose.test(curTemplatePlace)) {
            const match: any = regTagClose.exec(curTemplatePlace)
            console.log('匹配到了尾部', regTagClose.exec(curTemplatePlace));
            tagStack.pop()
            point += match[0].length - 1
            continue
        }

        // 匹配到了标签头部
        if (regTagOpen.test(curTemplatePlace)) {
            const match: any = regTagOpen.exec(curTemplatePlace)
            let tagFragment: string = match[1]
            let tag: string
            let attrs: any

            const res: any = searchTagAndProps(tagFragment)
            tag = res.tag
            attrs = res.attrs


            // tagStack.push(tag)
            const tagPath = {tag, tid}
            tagStack.push(tagPath)
            console.log('匹配到了头', regTagOpen.exec(curTemplatePlace));

            insertTreeNodeToAST(tagPath, attrs, astTree, tagStack)

            tid++
            // 将指针移动到闭合标签的 >位置，以供内容匹配
            point += match[0].length - 1
            continue
        }
        // 都没有中则指针前移
        point++
    }

    /*
      @description 删除tid标识
    */
    removeAstTreePathSign(astTree)
    resultCode.innerText = JSON.stringify(astTree)
    console.log('@ast', astTree)

}


function clearSpace(str: string) {
    return str.replace(/\n/g, '')
}

/*
  @description 结构一个标签上的所有属性，并以对象形式返回
*/
function searchTagAndProps(tagFragment: string) {
    let tag: string
    const attrs: any = []
    const props: any = []
    // 纯html字符串
    if (!tagFragment.match(/\s+/)) {
        tag = tagFragment
    } else {
        tagFragment = tagFragment.trim()
        let firstSpaceIndex = tagFragment.indexOf(' ')
        tag = tagFragment.substring(0, firstSpaceIndex)
        // 删去匹配字段，除去两边空格（如 ' class="title" style=" {color:`#ace`} "' 变为 'class="title" style="{color:`#ace`}"'）
        tagFragment = tagFragment.substring(firstSpaceIndex).trim()

        // 遍历查找所有属性以空格为参考点(不包含""内容的)
        const validGapSpace = []
        let point = 0
        let isPropsIndex = 0
        let preIsSpace = false
        // 得到有效属性分割点
        // 找到点位直接截取，然后重新的起点继续寻找符合要求的属性
        while (point < tagFragment.length) {
            const c = tagFragment[point]
            // 控制是否处于一个属性的引号内 （\' || \" 用来转移一个 '字符 ，通常用于和外包裹引号相同的情况                   ）
            if (c === '"' || c === "'" || c === '\'' || c === "\"") {
                if (isPropsIndex) isPropsIndex--
                else isPropsIndex++
            }

            // 查找符合要求的最后一个空格
            if (c.match(/\s/) && !isPropsIndex && point + 1 < tagFragment.length
                && (tagFragment[point + 1].match(/\s/))) {
                point++
                continue
            }

            // 找到空格,且不在属性内部, 是需要保存的节点
            if (c.match(/\s/) && !isPropsIndex) {
                validGapSpace.push(point)
            }

            point++
        }

        // 分隔多个属性属性（只允许单一空格，没有做深层处理）
        for (let i = 0; i < validGapSpace.length; i++) {
            if (i == 0) {
                props.push(tagFragment.substring(0, validGapSpace[0]))
            } else {
                props.push(tagFragment.substring(validGapSpace[i - 1], validGapSpace[i]))
            }

            // 如果是最后一个直接截取最后的属性
            if (i == validGapSpace.length - 1) {
                props.push(tagFragment.substring(validGapSpace[i]))
            }
        }

        // 说明只有一个属性
        if (validGapSpace.length == 0) {
            props.push(tagFragment)
        }
        // 将属性隐射到attrs中
        props.forEach((p: string) => {
            const prop = p.split('=')
            const name = prop[0]
            //@ts-ignore
            const value = prop[1].match(/.(.*)./)[1]
            attrs.push({name, value})
        })

    }
    return {
        tag, attrs
    }
}

/*
  @description 将对应的开合标签按照ast树进行存储
*/
function insertTreeNodeToAST(tagPath: any, attrs: any, astTree: any[], tagStack: any[], text?: string) {
    // 插入对应的tagStack节点后
    if (tagStack.length > 1) {

        const textStackPath = tagStack
        const tagTmp = [...tagStack]
        tagTmp.pop()
        const tagStackPath: any = tagTmp
        // 遍历每一个根ast树（需要深度和广度同时遍历）
        astTree.forEach((rootNode: any) => {
            let linkPoint: any = rootNode

            /*
              @description 如果是文本节点则找相同的treeNode
            */
            let vNode: any
            if (text) {
                vNode = searchSameTagTreeNode(textStackPath, rootNode, 0)
            } else {
                vNode = searchSameTagTreeNode(tagStackPath, rootNode, 0)
            }

            // 判断是否找到对应的虚拟节点，如未找到说明在第二颗树中
            if (vNode) {


                if (!vNode.children) {
                    vNode.children = []
                }
                let node: any
                if (text) node = {text, type: 3}
                else node = {...tagPath, attrs, type: 1}
                vNode.children.push(node)
            }

        })

    } else {
        // 根节点
        astTree.push({...tagPath, attrs, type: 1})

    }
}


/*
  @description  在treeNode中查找相同的接待你并返回引用，如果是文本节点则查找相同的treeNode
  @attempt
*/
function searchSameTagTreeNode(stackPath: any, treeNode: any, deepIndex: number): any {

    // 找到了一个可复用的节点
    if (treeNode.tag === stackPath[deepIndex].tag && treeNode.tid === stackPath[deepIndex].tid) {
        deepIndex++
        if (deepIndex === stackPath.length) {
            return treeNode
        }
        // 需要继续找需要用到的节点
        if (treeNode.children) {

            for (let i = 0; i < treeNode.children.length; i++) {
                const res = searchSameTagTreeNode(stackPath, treeNode.children[i], deepIndex)
                if (res) return res
            }
        }
    }
}


/*
  @description 移除路径标识符
*/
function removeAstTreePathSign(astTree: any[]) {
    astTree.forEach((treeNode: any) => {
        // 遍历每颗根子树删除tid属性
        removeAstTreeTid(treeNode)
    })
}

/*
  @description 递归深度遍历删除tid属性
*/
function removeAstTreeTid(treeNode: any) {
    if (Reflect.has(treeNode, 'tid')) {
        Reflect.deleteProperty(treeNode, 'tid')
    }
    if (Reflect.has(treeNode, 'children')) {
        for (let i = 0; i < treeNode.children.length; i++) {
            removeAstTreeTid(treeNode.children[i])
        }
    }
}
