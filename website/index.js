import { loadModel, average } from "../module/index.js"

function run() {
    const button1 = document.getElementById("model1")
    const button2 = document.getElementById("model2")
    const input1 = document.getElementById("input1")
    const input2 = document.getElementById("input2")
    const h1 = document.getElementById("h1")
    const layers1 = document.getElementById("layers1")
    const acc1 = document.getElementById("acc1")
    const layers2 = document.getElementById("layers2")
    const acc3 = document.getElementById("acc2")
    const h2 = document.getElementById("h2")
    button1.addEventListener("click",(e) => {
        e.preventDefault()
        input1.click()
    })
    button2.addEventListener("click",(e) => {
        e.preventDefault()
        input2.click()
    })
    input1.addEventListener("change", async(e) => {
        h1.textContent = e.target.files[0].name.slice(0,e.target.files[0].name.length-5)
        let file = await e.target.files[0].text()
        console.log(JSON.parse(file))
        let model = loadModel(JSON.parse(file))
        let list = []
        for (let layer of model.layers) {
            list.push(layer.biases.rows[0].length)
        }
        layers1.textContent = "layers : " + JSON.stringify(list)
        acc1.textContent = "estimated accuracy : " + model.test(average,100)
        
    })
    input2.addEventListener("change",async (e) => {
        h2.textContent = e.target.files[0].name.slice(0,e.target.files[0].name.length-5)
        let file = await e.target.files[0].text()
        console.log(JSON.parse(file))
        let model = loadModel(JSON.parse(file))
        let list = []
        for (let layer of model.layers) {
            list.push(layer.biases.rows[0].length)
        }
        layers2.textContent = "layers : " + JSON.stringify(list)
        acc2.textContent = "estimated accuracy : " + model.test(average,100)
    })
}
document.addEventListener("DOMContentLoaded", () => {
    run()
})