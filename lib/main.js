import { getModel } from "../data/main.js"
import { saveModel } from "../data/main.js"
export function sigmoid(n) {
    return 1 / ( 1 + Math.pow(Math.E, -n))
}
export function xavier(sum) {
    let lowerBound = Math.sqrt(6/sum)
    return Math.random() * (2 * lowerBound) - lowerBound
}
export function softmax(vector) {
    let numbers = vector.list
    let sum = 0
    for (let number of numbers ) {
        sum +=(Math.exp(number))
    }
    let list = []
    for (let number of numbers) {
        list.push(Math.exp(number) / sum)
    }
    return new Vector(list.length, list)
}
export function absorbGradients(model, layers) {
    for (let i  = 0; i< layers.length; i++) {
        model.layers[i].delta = layers[i][0]
        model.layers[i].gradients = layers[i][1]
    }
}
export function modelToGradients(model) {
    let layers = []
    for (let i = 0; i < model.layers.length; i++) {
        layers.push([model.layers[i].delta, model.layers[i].gradients])
    }
    return layers
}
export function generateInputs(inputNeurons, size, func) {
    let input = []
    let output = []
    for (let i = 0; i < size; i++) { 
        let list = []
        for (let a = 0; a < inputNeurons; a ++) {
            
            let random = Math.ceil(Math.random() * 100)/100
            list.push(random)
        }
        input.push(list)
        output.push(func(list))

    }
    return [input, output]
}
export function averageMatrix(matrixes) {
    let sum = new Matrix(1, [])
    for (let i = 0; i < matrixes.length; i++ ) {
        if (i == 0) {
            sum = matrixes[i]
        } else {
            sum = matrixAddition(sum, matrixes[i])
        }
    }
    let vectors = []
    for (let vector of sum.vectors) {
        let list = []
        for (let element of vector.list) {
            list.push(element / matrixes.length)
        }
        vectors.push(new Vector(list.length, list))
    }
    return new Matrix(vectors.length, vectors)
}
export function averageDeltas(models) {
    let layers = []
    for (let i = 0; i < models[0].length; i++) {
        let listDelta = []
        let listGradients = []
        for (let a = 0; a < models.length; a++) {
            if (i == 0) {
                listDelta.push(models[a][i][0])
            } else {
                listDelta.push(models[a][i][0])
                listGradients.push(models[a][i][1])
            }
        }
        layers.push([averageMatrix(listDelta), averageMatrix(listGradients)])
    } 
    return layers
}
export class Vector {
    constructor(dimension, list) {
        this.dimension = dimension
        this.list = list
    }
}
export function vectorElementMultiplication(a, b) {
    if (a.dimension != b.dimension) {
        throw new Error("vector element multiplication impossible")
    } else {
        let list = []
        for (let i = 0; i < a.dimension ; i++) {
            list.push(a.list[i] * b.list[i])
        }
        return new Vector(list.length, list)
    }
}
export function weigthMatrixes(model, layer) {
    let listStarting = []
    let listEnding = []
    if (layer == 0) {
        for (let neuron of model.layers[layer].neurons) {
            let list = []
            for (let weigth of model.layers[layer].startingWeigths) {
                if (weigth.starting.index == neuron.index) {
                    list.push(weigth.value)
                }
            }
            listStarting.push(list)
        }
    } else if (layer == model.layers.length -1) {
        for (let neuron of model.layers[layer].neurons) {
            let list = []
            for (let weight of model.layers[layer].endingWeigths) {
                if (weight.ending.index == neuron.index) {
                    list.push(weight.value)
                }
            }
            listEnding.push(list)
        }
    } else {
        for (let neuron of model.layers[layer].neurons) {
            let list = []
            for (let weigth of model.layers[layer].startingWeigths) {
                if (weigth.starting.index == neuron.index) {
                    list.push(weigth.value)
                }
            }
            listStarting.push(list)
        }
        for (let neuron of model.layers[layer].neurons) {
            let list = []
            for (let weight of model.layers[layer].endingWeigths) {
                if (weight.ending.index == neuron.index) {
                    list.push(weight.value)
                }
            }
            listEnding.push(list)
        }
    }
    let endingVectors = []
    let startingVectors = []
    for (let list of listStarting) {
        startingVectors.push(new Vector(list.length, list))
    }
    for (let list of listEnding)  {
        endingVectors.push(new Vector(list.length, list))
    }
    return [new Matrix(startingVectors.length, startingVectors), new Matrix(endingVectors.length, endingVectors)]
}
export function vectorAddition(a, b) {
    if (a.dimension != b.dimension) {
        throw new Error("vector addition impossible")
    } else {
        let cList = []
        for (let i = 0; i < a.list.length; i++) {
            cList.push(a.list[i] + b.list[i])
        }
        return new Vector(cList.length, cList)
    }
}
export function matrixAddition(Ma, b) {
    if (Ma.size()[0] != b.size()[0]|| Ma.size()[1] != b.size()[1]) {
        throw new Error("addition impossible")
    }
    else {
        let vectors = []
        for (let i = 0; i < Ma.vectors.length; i++) {
            let list = []
            for (let a = 0; a < Ma.vectors[i].list.length; a++) {
                list.push(Ma.vectors[i].list[a] + b.vectors[i].list[a])
            }
            vectors.push(new Vector(list.length, list))
        }
        return new Matrix(vectors.length, vectors)
    }
}
export function matrixMultiplication (a, b) {
    if (a.size()[1] != b.size()[0]) {
        throw new Error("multiplication impossibole")
    } else {
        let size = [a.size()[0], b.size[1]]
        let matrixList = []
        for (let i = 0; i < size[0]; i++) {
            matrixList.push([])
        }
        for (let  i = 0; i < a.size()[0]; i++) {
            for (let j = 0; j < b.size()[1]; j++) {
                let sum = 0
                for (let k = 0; k < a.size()[1]; k++) {
                    sum += a.vectors[i].list[k] * b.vectors[k].list[j]
                } 
                matrixList[i][j] = sum
            }
        }
        let vectors = []
        for (let list of matrixList) {
            vectors.push(new Vector(list.length, list))
        }
        return new Matrix(vectors.length, vectors)

    }
}
export class Matrix {
    constructor(dimension, vectors) {
        this.dimension = dimension
        this.vectors = vectors
    }
    size () {
        return [this.dimension, this.vectors[0].dimension]
    }
    transpose () {
        let numbers = []
        for (let vector of this.vectors) {
            numbers.push(vector.list)
        }
        numbers = numbers.flat(2)
        let lists = []
        for (let i = 0; i < this.size()[1];i++) {
            let list = []
            for (let a = 0; a < this.size()[0]; a++) {
                list.push(numbers[i + a * this.size()[1]])
            }
            lists.push(list)
        }
        let vectors = []
        for (let list of lists) {
            vectors.push(new Vector(list.length, list))
        }
        return new Matrix(vectors.length, vectors)
    }
}
export class Neuron {
    constructor(value, bias, index)  {
        this.value = value
        this.bias = bias
        this.index = index
    }
    changeValue(value) {
        this.value = value
    }
    changeBias(bias) {
        this.bias = bias
    }
    verbose() {
        console.log(`{ value : ${this.value}, bias : ${this.bias}}`)
    }
}
export class Weigth {
    constructor(value, starting, ending) {
        this.value = value
        this.starting = starting
        this.ending = ending
    }
    changeValue(value) {
        this.value = value
    }
}
export class Layer {
    constructor(neurons, startingWeigths, endingWeigths) {
        this.neurons = neurons
        this.startingWeigths = startingWeigths
        this.endingWeigths = endingWeigths
    }
    changeZ(z) {
        this.z = z
    }
    changeDelta(delta) {
        this.delta = delta
    }
    changeGradients(gradients) {
        this.gradients = gradients
    }
    activationDerivatives() {
        let list = []
        for (let neuron of this.neurons) {
            list.push(neuron.value * (1 - neuron.value))
        }
        return new Vector(list.length, list)
    }

}
export class Model {
    constructor(layers, softmax) {
        this.layers = layers
        this.storage = []
        this.softmax = softmax
        
    }
    push(value) {
        this.storage.push(value)
    }
    reset() {
        this.storage = []
    }
    forward(input) {
        for (let i = 0; i < this.layers[0].neurons.length; i++) {
            this.layers[0].neurons[i].changeValue(input[i])
        }
        for (let i = 1; i < this.layers.length; i++) {
            let values = []
            let biases = []
            let vectors = []
            for (let neuron of this.layers[i - 1].neurons) {
                values.push(neuron.value)
            }
            for (let neuron of this.layers[i].neurons) {
                biases.push(neuron.bias)
            }
            let base_index = this.layers[i].neurons[0].index
            let xV = new Vector(values.length, values)
            let x = new Matrix(1, [xV])
            let bV = new Vector(biases.length, biases)
            let b = new Matrix(1, [bV])
            for (let neuron of this.layers[i - 1].neurons) {
                let list = []
                for (let weigth of this.layers[i].endingWeigths) {
                    if (weigth.starting.index == neuron.index) {
                        list.push(weigth.value)
                    }
                }
                vectors.push(new Vector(list.length, list))
            }
            let weights = new Matrix(vectors.length, vectors)
            let z = matrixAddition(matrixMultiplication(x,weights), b)
            if (z.size()[0] != 1) {
                throw new Error("z mismatch size")
            } else {
                this.layers[i].changeZ(z)
                for (let neuron of this.layers[i].neurons) {
                    let list = z.vectors[0].list
                    if (!this.softmax) {
                    neuron.changeValue(sigmoid(list[neuron.index - base_index]))
                    } else {
                        list = softmax(z.vectors[0]).list
                        neuron.changeValue(list[neuron.index- base_index])
                    }
                }
                
            }
        }
    }
    cost(output) {
        if (output.length != this.layers[this.layers.length - 1].neurons.length) {
            throw new Error("cost impossible")
        }
        let last = this.layers.length - 1
        let list = []
        for (let i = 0; i < output.length; i++) {
            list.push((output[i] - this.layers[last].neurons[i].value) ** 2)
        }
        return new Vector(output.length, list)
    }
    costGradient(output) {
        if (output.length != this.layers[this.layers.length - 1].neurons.length) {
            throw new Error("cost impossible")
        }
        let last = this.layers.length - 1
        let list = []
        for (let i = 0; i < output.length; i++) {
            list.push((this.layers[last].neurons[i].value - output[i]) * 2)
        }
        return new Vector(output.length, list)        
    }
    backpropagate(output, i) {
        for (let i = this.layers.length - 1; i >=0; i--) {
            if (i == this.layers.length -1) {
                let costGradient = this.costGradient(output)
                let activationDerivatives = this.layers[i].activationDerivatives()
                let deltaVector = vectorElementMultiplication(costGradient, activationDerivatives)
                let list = []
                for (let i = 0;i < deltaVector.list.length; i++) {
                    list.push(new Vector(1, [deltaVector.list[i]]))
                }
                let delta = new Matrix(list.length, list)
                this.layers[i].changeDelta(delta)
            }
            else {
                let matrix = matrixMultiplication(weigthMatrixes(this, i + 1)[1].transpose(), this.layers[i + 1].delta)
                let activationDerivatives = this.layers[i].activationDerivatives()
                let list = []
                for (let vector of matrix.vectors) {
                    list.push(vector.list[0])
                }
                let vector = new Vector(list.length, list)
                let deltaVector = vectorElementMultiplication(vector, activationDerivatives)
                let Nlist = []
                for (let i = 0;i < deltaVector.list.length; i++) {
                    Nlist.push(new Vector(1, [deltaVector.list[i]]))
                }
                let delta = new Matrix(Nlist.length, Nlist)
                this.layers[i].changeDelta(delta)
            }
        }
        for (let i = 1; i < this.layers.length; i++) {
            let list = []
            for (let neuron of this.layers[i-1].neurons) {
                list.push(new Vector(1, [neuron.value]))
            }
            let a = new Matrix(list.length, list)
            let gradient = matrixMultiplication(this.layers[i].delta, a.transpose())
            this.layers[i].changeGradients(gradient)
        }
        this.push({"index" : i,"model": modelToGradients(this)})
        for (let layer of this.layers) {
            layer.delta = undefined
            layer.gradients = undefined
        }
        
    }
    updateValues(learingRate, i) {
        let obj = {}
        for (let element of this.storage) {
            if (element.index == i) {
                obj = element.model
            }
        }
        for (let i = 0; i < this.layers.length; i++) {
            let biasList = []
            for (let neuron of this.layers[i].neurons) {
                biasList.push(neuron.bias)
            }
            let b = new Vector(biasList.length, biasList)
            let xList = []
            for (let vector of obj[i][0].vectors) {
                xList.push(vector.list[0] * (-learingRate))
            }
            let x = new Vector(xList.length, xList)
            let newBiases = vectorAddition(b, x) 
            for (let a = 0; a < this.layers[i].neurons.length;a++) {
                this.layers[i].neurons[a].changeBias(newBiases.list[a])
            } if (i != 0) {
                let xList = []
                for (let vector of obj[i][1].vectors) {
                    let newVecList = []
                    for (let value  of vector.list) {
                        newVecList.push(value * (-learingRate))
                    }
                    xList.push(new Vector(newVecList.length, newVecList))
                }
                let x = new Matrix(xList.length, xList)
                let w = weigthMatrixes(this, i)[1]
                let values = matrixAddition(w, x)                    
                for (let a = 0; a < this.layers[i].neurons.length; a++) {
                    let index = 0
                    for (let weigth of this.layers[i].endingWeigths) {
                        if (this.layers[i].neurons[a].index == weigth.ending.index) {
                            weigth.changeValue(values.vectors[a].list[index])
                            index++
                        }
                    }
                }
            }
        }
    }
    train(epochs, batchsize, inputs, outputs, learingRate, softmax) {
        for (let i = 0; i < epochs; i++) {
            let sum = 0
            for (let a = 1; a < inputs.length; a++) {
                this.forward(inputs[a])
                this.backpropagate(outputs[a], a)
                if (Number.isInteger(a / batchsize)) {
                    let models = []
                    for (let j = a - batchsize +1; j <= a;j++) {
                        for (let element of this.storage) {
                            if (element.index == j) {
                                models.push(element.model)
                            }
                        }
                    }
                    this.reset()
                    this.push({"index": a, "model" : averageDeltas(models)})
                    this.updateValues(learingRate, a)
                    this.reset()
                    sum += this.cost(outputs[a] ).list[0]
                }
                    console.clear()
                    console.log(a, "/", inputs.length, "   ", i, "/",epochs)
            }
        }
    }
    predict(input) {
        this.forward(input) 
        
    }
    save(name) {
        let layers = []
        for (let i = 0; i < this.layers.length; i++) {
            let neuronList = []
            let startingWeightList = []
            let endingWeightList = []
            for (let neuron of this.layers[i].neurons) {
                neuronList.push({"index" : neuron.index, "value" : neuron.value, "bias" : neuron.bias})
            } for (let weight of this.layers[i].startingWeigths) {
                startingWeightList.push({"value" : weight.value, "starting" : {"index" : weight.starting.index, "value" : weight.starting.value, "bias" : weight.starting.bias}, "ending": {"index" : weight.ending.index, "value" : weight.ending.value, "bias" : weight.ending.bias}})
            }
            for (let weight of this.layers[i].endingWeigths) {
                endingWeightList.push({"value" : weight.value, "starting" : {"index" : weight.starting.index, "value" : weight.starting.value, "bias" : weight.starting.bias}, "ending": {"index" : weight.ending.index, "value" : weight.ending.value, "bias" : weight.ending.bias}})
            }
            layers.push({"neurons" : neuronList, "startingWeights" : startingWeightList, "endingWeigths" : endingWeightList})
        }
        let obj = {"name" : name, "model" : layers, "softmax" : this.softmax}
       saveModel(obj, name)
    }
    
}
export function loadModel(name) {
    let obj = getModel(name)
    if (obj == undefined) {
        throw new Error("inexistent model")
    } else {
        let layers = []
        for (let i = 0; i < obj.model.length; i++) {
            let neurons = []
            let startingWeights = []
            let endingWeigths = []
            console.log(obj.model[i])
            for (let neuron of obj.model[i].neurons) {
                neurons.push(new Neuron(neuron.value, neuron.bias, neuron.index))
            }
            for (let weigth of obj.model[i].startingWeights) {
                startingWeights.push(new Weigth(weigth.value, new Neuron(weigth.starting.value, weigth.starting.bias, weigth.starting.index), new Neuron(weigth.ending.value, weigth.ending.bias, weigth.ending.index)))
            }
            for (let weigth of obj.model[i].endingWeigths) {
                endingWeigths.push(new Weigth(weigth.value, new Neuron(weigth.starting.value, weigth.starting.bias, weigth.starting.index), new Neuron(weigth.ending.value, weigth.ending.bias, weigth.ending.index)))
            }
            layers.push(new Layer(neurons, startingWeights, endingWeigths))
        }
        return new Model(layers, obj.softmax)
    }
}
export function generateModel(layers, neurons, softmax) {
    if (layers < 2) {
        throw new Error("too little layers")
    } if (layers !== neurons.length) {
        throw new Error("number mismatch")
    } else {
        let layerList = []
        let NeuronList = []
        for (let i = 0; i < layers; i++) {
            let list = []
            for (let a = 0; a < neurons[i]; a++) {
                if (i == 0) {
                    let n = new Neuron(0, 0, a)
                    list.push(n)
                }
                else {
                    let sum = 0;
                    for (let b = 0; b < i; b++) {
                        sum += neurons[b]
                    }
                    let n = new Neuron(0,0,sum + a)
                    list.push(n)
                }
            }
            NeuronList.push(list)
        }
        for (let i = 0; i < layers; i++ ){
            let endingWeigths = []
            let startingWeigths = []
            if ( i == 0) {
                let current = NeuronList[0]
                let next = NeuronList[1]
                for (let starting of current) {
                    for (let ending of next) {
                        startingWeigths.push(new Weigth(xavier(current.length + next.length), starting, ending))
                    }
                }
            } else if (i == layers - 1) {
                let current = NeuronList[i]
                let prev = NeuronList[i - 1]
                for (let starting of prev) {
                    for (let ending of current) {
                        endingWeigths.push(new Weigth(xavier(current.length + prev.length), starting, ending))
                    }
                }                
            } else {
                let current = NeuronList[i]
                let next = NeuronList[i + 1]
                for (let starting of current) {
                    for (let ending of next) {
                        startingWeigths.push(new Weigth(xavier(current.length + next.length), starting, ending))
                    }
                }
                endingWeigths = layerList[i - 1].startingWeigths
            }
            
            layerList.push(new Layer(NeuronList[i], startingWeigths, endingWeigths))
        }
        return new Model(layerList, softmax)
    }
}
export function sameSet(a, b) {
    if (a.size !== b.size) return false;
    for (let v of a) {
        if (!b.has(v)) return false;
    }
    return true;
}