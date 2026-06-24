import { loadModel, average,generateInputs,Vector } from "../module/index.js"

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
    const start = document.getElementById("start")
    let model1;
    let model2;
        start.style.display = "none" 
        start.disabled = true
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
        model1 = loadModel(JSON.parse(file))
        let list = []
        for (let layer of model1.layers) {
            list.push(layer.biases.rows[0].length)
        }
        layers1.textContent = "layers : " + JSON.stringify(list)
        acc1.textContent = "estimated accuracy : " + model1.test(average,100)
        if (h1.textContent != "select model" && h2.textContent != "select model") {
            start.style.display = "block"
            start.disabled = false

        }
    })
    input2.addEventListener("change",async (e) => {
        h2.textContent = e.target.files[0].name.slice(0,e.target.files[0].name.length-5)
        let file = await e.target.files[0].text()
         model2 = loadModel(JSON.parse(file))
        let list = []
        for (let layer of model2.layers) {
            list.push(layer.biases.rows[0].length)
        }
        layers2.textContent = "layers : " + JSON.stringify(list)
        acc2.textContent = "estimated accuracy : " + model2.test(average,100)
        if (h1.textContent != "select model" && h2.textContent != "select model") {
            start.style.display = "block"
            start.disabled = false

        }
        
    })

    start.addEventListener("click", (e) => {
        let rounds = Number.parseInt(prompt("rounds : "))
        let lossA = 0;
        let lossB = 0;
        let data = generateInputs(model1.layers[0].biases.rows[0].length, rounds, average)
        for (let i = 0; i < rounds; i++)  {
            model1.forward(data[0][i])
            model2.forward(data[0][i])
            lossA += model1.cost(data[1][i]).list[0]
            lossB += model2.cost(data[1][i]).list[0]
            
        }
        if (lossA > lossB) {
           alert(h2.textContent + " wins")

        } else {
            alert(h1.textContent + " wins")
        }
        console.log(lossA,lossB)
    })
}
document.addEventListener("DOMContentLoaded", () => {
    run()
})