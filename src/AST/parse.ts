export default function (template: string) {
    const regTagOpen = /^<(.*?)\s*?>/
    const regTagClose = /^<\/(.*?)\s*?>/
    const regContent = /^>(.*?)</
    const tagStack = []
    template = clearSpace(template)
    console.log('@template', template)
    let point = 0
    const templateLen = template.length
    const astTree = {}
    while (point < templateLen) {


        const curTemplatePlace = template.substring(point)

        // 匹配到了内容
        if (regContent.test(curTemplatePlace)) {
            const match: any = regContent.exec(curTemplatePlace)
            console.log('匹配到了内容', regContent.exec(curTemplatePlace));
            point += match[1].length
            continue
        }

        // 匹配到了闭合标签
        if (regTagClose.test(curTemplatePlace)) {
            const match: any = regTagClose.exec(curTemplatePlace)
            console.log('匹配到了尾部', regTagClose.exec(curTemplatePlace));
            point += match[0].length - 1
            continue
        }

        // 匹配到了标签头部
        if (regTagOpen.test(curTemplatePlace)) {
            const match: any = regTagOpen.exec(curTemplatePlace)
            console.log('@head', match)
            let tagFragment: string = match[1]
            let tag: string
            let attrs: any

            const res: any = searchTagAndProps(tagFragment)
            tag = res.tag
            attrs = res.attrs

            tagStack.push(tag)
            console.log('匹配到了头', regTagOpen.exec(curTemplatePlace));
            point += match[0].length - 1
            continue
        }
        point++
    }
}

function clearSpace(str: string) {
    return str.replace(/\n/g, '')
}

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
        // 得到有效属性分割点
        // 找到点位直接截取，然后重新的起点继续寻找符合要求的属性
        while (point < tagFragment.length) {
            const c = tagFragment[point]
            // 控制是否处于一个属性的引号内 （\' || \" 用来转移一个 '字符 ，通常用于和外包裹引号相同的情况                   ）
            if (c === '"' || c === "'" || c === '\'' || c === "\"") {
                if (isPropsIndex) isPropsIndex--
                else isPropsIndex++
            }
            // 找到空格,且不在属性内部, 是需要保存的节点
            if (c.match(/\s/) && !isPropsIndex) {
                validGapSpace.push(point)
            }

            point++
        }

        // 分隔属性
        for (let i = 0; i < validGapSpace.length; i++) {
            if (i == 0) {
                props.push(tagFragment.substring(0, validGapSpace[0]))
            } else if (i == validGapSpace.length - 1) {
            } else props.push(tagFragment.substring(validGapSpace[i - 1], validGapSpace[i]))
        }
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