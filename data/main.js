import * as fs from "fs"
export function readFile() {
    let obj = JSON.parse(fs.readFileSync("./data/main.json", "utf8"))
    return obj
}
export function write(content) {
    fs.writeFileSync("./data/main.json", content, "utf-8") 
}
export function push(content) {
    let obj = readFile()
    obj.push(content)
    write(JSON.stringify(obj))
} 
export function clear() {
    write("[]")

 }
export function writeGradients(model, i) {
    let layers = []
    for (let i = 0; i < model.layers.length; i++) {
        let listDelta = []
        let listGradient = []
        for (let vector of model.layers[i].delta.vectors) {
            let temp = []
            for (let element of vector.list) {
                temp.push(element)
            }
            listDelta.push(temp)
        }
        if (i != 0) {
            
            for (let vector of model.layers[i].gradients.vectors) {
                let temp = []
                for (let element of vector.list) {
                    temp.push(element)
                }
                listGradient.push(temp)
            }
        }
        let obj = {"layer" : i, "deltas" : listDelta, "gradients" : listGradient}
        layers.push(obj)
    }
    let object = {"model" : layers, "index" : i}
    push(object)
}
export function readGradients(i) {
    let list = readFile()
    for (let obj of list) {
        if (obj.index == i) {
            let layers = []
            for (let layer of obj.model) {
                layers.push([layer.deltas, layer.gradients])
            }
            return layers
        }
    }
}