export function createElement(vNode: any): Element {
    const htmlObj = document.createElement(vNode.sel)
    console.log('@vNode', vNode)
    if (vNode.data) Object.keys(vNode.data).forEach(k => htmlObj.setAttribute(k, vNode.data[k]))
    vNode.elm = htmlObj
    if (vNode.text) htmlObj.innerText = vNode.text
    if (vNode.children) {
        const children = vNode.children
        if (Array.isArray(children)) children.forEach(c => htmlObj.appendChild(createElement(c)))
        else htmlObj.appendChild(createElement(children))
    }

    return htmlObj
}