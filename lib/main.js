export function sigmoid(n) {
    return 1 / ( 1 + Math.pow(Math.E, -n))
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
        for (let i = 0; i < weigths.length; i++) {
            if ( weigths[i].starting == neurons[i].index && weigths[i].ending == this.index) {
                value += (weigths[i].value * neurons[i].value)
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
