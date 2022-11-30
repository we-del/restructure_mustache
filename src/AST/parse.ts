export default function (template: string) {
    const regTagOpen = /^<(.*?)\s+(.*?)\s*>/
    const regTagClose = /^<\/(.*?)\s*>/
    const regContent = /^>(.*?)</
    let point = 0
    const templateLen = template.length
    while (point < templateLen) {
        const curTemplatePlace = template.substring(point)
        if (regTagOpen.test(curTemplatePlace)) {
            const match: any = regTagOpen.exec(curTemplatePlace)
            console.log('匹配到了头', regTagOpen.exec(curTemplatePlace));
            point += match?.length
            continue
        }
        if (regTagClose.test(curTemplatePlace)) {
            const match: any = regTagClose.exec(curTemplatePlace)
            console.log('匹配到了尾部', regTagClose.exec(curTemplatePlace));
            point += match?.length
            continue
        }
        if (regContent.test(curTemplatePlace)) {
            const match: any = regContent.exec(curTemplatePlace)
            console.log('匹配到了内容', regContent.exec(curTemplatePlace));
            point += match?.length
            continue
        }
        point++
    }
}

function clearSpace(str: string) {
    return str.replace(/\s/g, '')
}