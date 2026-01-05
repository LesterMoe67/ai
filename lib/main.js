export function sigmoid(n) {
    return 1 / ( 1 + Math.pow(Math.E, -n))
}
export function order(layer1, layer2) {
    if (layer1.startingWeigths.length == 0) {
        return [layer1, layer2]
    }
    if (layer2.startingWeigths.length == 0) {
        return [layer2, layer1]
    }
    if (layer1.endingWeigths == 0) {
        return [layer2, layer1]
    }
    if (layer2.endingWeigths == 0) {
        return [layer1, layer2]
    }
    let min = layer1.startingWeigths[0].starting
    let second = layer2.endingWeigths[layer2.endingWeigths.length - 1].ending
    if (min > second) {
        return [layer2, layer1]
    }
    return [layer1, layer2]
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
    calculateValue(weigths, neurons) {
        let value = 0
        let validWeigths = []
        for (let weight of weigths) {
                if (weight.ending == this.index) {
                    validWeigths.push(weight)
                }
        }
        if (validWeigths.length != neurons.length) {
            let string = ("length mismatch s:"+ validWeigths.length+neurons.length)
            throw new Error(string)
        }
        console.log(validWeigths)
        for (let i = 0; i < validWeigths.length; i++) {

            if ( validWeigths[i].starting == neurons[i].index && validWeigths[i].ending == this.index) {
                value += (validWeigths[i].value * neurons[i].value)
            }
        }
        value = -this.bias + (sigmoid(value))
        this.value = value
    }
    verbose() {
        console.log(`{ value : ${this.value}, bias : ${this.bias}}`)
    }
}
export function generateNeurons(count, value, bias, random, func,) {
    let list = []
    for (let i = 0; i < count; i++) {
        list.push(new Neuron(random ? Math.random() : value,random ? Math.random() : bias, func() ))
    }
    return list
}
export function generateWeigths(startingNeurons, endingNeurons, values, random) {
    let obj = []
    let weigths = []
    for (let starting of startingNeurons) {
        for (let ending of endingNeurons) {
            obj.push([starting.index, ending.index])
        }
    }
    for (let i = 0;  i < obj.length; i++) {
        let weigth = new Weigth(random ? (Math.random() * 10) - 5 : (values.length > 1 ? values[i] : values[0]), obj[i][0], obj[i][1])
        weigths.push(weigth)
    }
    return weigths
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
    calculateValues(prevLayer) {
        for (let neuron of this.neurons) {
            neuron.calculateValue(prevLayer.endingWeigths, prevLayer.neurons)
        }    
    }

}
export class Model {
    constructor(layers) {
        this.layers = layers
    }
    calculate(layer1, layer2) {
        let layers = order(layer1, layer2)
        layers[1].calculateValues(layers[0])
    }
    execute(input) {
        let startingLayer = []
        for (let layer of this.layers) {
            if (layer.startingWeigths.length == 0 && layer.neurons.length == input.length) {
                startingLayer.push(layer)
            }
        }
        if (startingLayer.length > 1) {
            throw new Error("more that one starting")
        }
        if (startingLayer.length < 1) {
            throw new Error("no starting")
        }
        for (let i = 0; i < input.length; i++) {
            startingLayer[0].neurons[i].changeValue(input[i])
        }
        for (let i = 1; i < this.layers.length; i++) {
            this.calculate(this.layers[i- 1], this.layers[i])
        }
        return this.layers[this.layers.length - 1].neurons
    }
}