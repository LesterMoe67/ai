import { deleteModel, input } from "./data/main.js"
import  { sigmoid, Layer, Model, sameSet, Vector, Matrix, xavier, generateModel, matrixMultiplication, matrixAddition, vectorElementMultiplication, vectorAddition, averageMatrix, generateInputs, matrixSubtraction, loadModel} from "./lib/main.js"
function average (list) {
    let sum = 0
    for (let el of list) {
        sum += el

    }
    return [sum / list.length]
}
function xor (list) {
    
}
let running = true
let model = undefined
let config = {"autosave" : false, "name" : ""} 
while (running) {
    let string = input("command : ")
    switch(string) {
        case "exit" :
            running = false
            if (config.autosave) {
                model.save(config.name)
            }
            break;
        case "init":
            let layers = Number.parseInt(input("layers : "))
            let neurons = []
            for (let i = 0; i< layers; i++) {
                neurons.push(Number.parseInt(input("neurons for layer " + (i + 1) + " : ")))
            }
            model = generateModel(layers, neurons)
            if (config.autosave) {
                model.save(config.name)
            }
            break;
        case "train":
            let epochs = Number.parseInt(input("epochs : "))
            let batchSize = Number.parseInt(input("batch size : "))
            let dataSetSize = Number.parseInt(input("dataset size : "))
            let learningRate = Number.parseFloat(input("learning rate : "))
            let data = generateInputs(model.layers[0].biases.rows[0].length, dataSetSize, average)
            model.train(epochs, batchSize, data[0], data[1], learningRate)
            if (config.autosave) {
                model.save(config.name)
            }
            break;
        case "load":
            let name = input("name : ")
            model = loadModel(name)
            break;
        case "save":
            let nae;
            if (config.name == "") {
                nae = input("name : ")
            } else {
                nae = config.name
            }
            model.save(nae)
            break;
        case "predict":
            let inputs = []
            for (let i = 0; i <model.layers[0].biases.rows[0].length; i++)  {
                inputs.push(Number.parseFloat(input("input number " + (i + 1)  + " : ")))
            }
            model.predict(inputs)
            if (config.autosave) {
                model.save(config.name)
            }
            break;
        case "test":
            let size = Number.parseInt(input("insert size: "))
            model.test(model.layers[0].biases.rows[0].length, average, size)
            break;
        case "config":
            let autosave = input("autosave : ") == "true"
            if (autosave) {
                let name = input("name : ")
                config.name = name

            }
            config.autosave = autosave
            break;
        case "delete":
            let namer = input("name : ")
            deleteModel(namer)
            break;
        }
        

}
