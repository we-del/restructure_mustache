import parse from "@/AST/parse";

export default function () {
    // const template = `
    //     <div class="box">
    //         <h3 class="title">我是一个标题</h3>
    //         <ul>
    //             <li v-for="item in arr" :key="index">
    //                 {{item}}
    //             </li>
    //         </ul>
    //         <div  v-if="true" :key="333"  class="test"  ></div>
    //     </div>
    // `

    // 复杂测试用例
    const template = `
        <div class="box">
            <h3 class="title">我是一个标题</h3>
            <ul>
                <li v-for="item in arr" :key="index">
                    {{item}}
                </li>
            </ul>
            <div class="test">我来测试ast1</div>
            <div class="test">我来测试ast2</div>
            <div class="test">我来测试ast3</div>
            <div class="test">我来测试ast4</div>
            <div class="test">
                <ol v-if="true" id="order">
                    <li v-for="i in 5">{{i}}</li>
                </ol>
            </div>
            <div class="test">我来测试ast5
                <div>
                    <div></div>
                </div>
            </div>


        </div>
        <div id="pibox">
            <ul>
                <li>3</li>
                <li>4</li>
                <li>5</li>
                <li>6</li>
                <li>7</li>
            </ul>
            <div>展示1</div>
            <div>展示2</div>
            <div>展示3</div>
            <div>展示4</div>
            <div>展示5</div>
        </div>
    `
    parse(template)
}