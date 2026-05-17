import { input } from "./data/main.js"
import  {Neuron, sigmoid, Weigth, Layer, Model, sameSet, Vector, Matrix, xavier, generateModel, matrixMultiplication, matrixAddition, vectorElementMultiplication, weigthMatrixes, vectorAddition, averageMatrix, generateInputs, loadModel} from "./lib/main.js"
let exit = false
    let model;
function training(list) {
    let output = []
    for (let number of list) {
        if (number == Math.max(...list)) {
            output.push(1)
        }
        else {
            output.push(0)
        }
    }
    return output
}
while (!exit) {
    let output = input("comand : ")

    switch(output) {
        case "exit" :
            exit = true
            break;
        case "load" :
            let name = input("name : ")
            model = loadModel(name)
            break;
        case "create" :
            let layers = input("number of layers : ")
            let list = []
            for (let i = 0; i < Number.parseInt(layers); i++) {
                list.push(Number.parseInt(input("neurons on layer number " + (i + 1)+  " : ")))
            }
            let softmax = input("softmax : ") == "true"
            model = generateModel(Number.parseInt(layers), list, softmax)
            break;
        case "train":
            if (model == undefined) {
                console.log("no model available ")
            } else {
                let epochs = Number.parseInt(input("epochs : "))
                let inputSize = Number.parseInt(input("dataset size : "))
                let batchsize = Number.parseInt(input("batch size : "))
                let learingRate = Number.parseInt(input("learing rate : "))
                let data = generateInputs(model.layers[0].neurons.length, inputSize, training)
                model.train(epochs, batchsize, data[0], data[1], learingRate)
            }
            break;
        case "save":
            let nae = input("name : ")
            model.save(nae)
            break;
        case "predict":
            let inputs = []
            for (let i = 0; i < model.layers[0].neurons.length;i++) {
                inputs.push(Number.parseInt(input("input number " + (i + 1) + " : ")))
            }
            model.forward(inputs)
            console.log(model.layers[model.layers.length - 1].neurons)
            break;
        default:
            console.log("sybau")
    }
}