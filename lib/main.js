import { getModel } from "../data/main.js"
import { saveModel } from "../data/main.js"
export function sigmoid(n) {
    return 1 / ( 1 + Math.pow(Math.E, -n))
}
export function accuracy(expected, real) {
    let sum = 0
    for (let i = 0; i < expected.length; i++) {
        sum += 1 -  Math.abs(expected[i] - real[i]) / (expected[i] + 0.000000000000000000000000000000000000000000000000000000000000001)  
    } 
    return sum * 10 
}
export function leakyRelu(x) {
    return x > 0 ? x : 0.01 * x;
}

export function xavier(sum) {
    let lowerBound = Math.sqrt(6/sum)
    return Math.random() * (2 * lowerBound) - lowerBound
}
export function heInit(fanIn) {
    let std = Math.sqrt(2 / fanIn);
    return (Math.random() * 2 - 1) * std;
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
    if (!matrixes.length) {
        throw new Error("averageMatrix got empty input");
    }

    let sum = matrixes[0];
    for (let i = 1; i < matrixes.length; i++) {
        sum = matrixAddition(sum, matrixes[i])
    }

    function divideBylength(length) {
       let res = (n) => { 
         return parseFloat(n)/length
       }
       return res
    }
    let res =  matrixOperator(sum, divideBylength(10));
    return res
}
export function averageDeltas(models) {
    let layers = [];

    for (let i = 0; i < models[0].model.length; i++) {

        let listDelta = [];
        let listGradients = [];

        for (let a = 0; a < models.length; a++) {
            if (models[a].model[i][0]) {
                listDelta.push(models[a].model[i][0]);
            }
            // only push gradients if they exist
            if (models[a].model[i][1]) {
                listGradients.push(models[a].model[i][1]);
            }
        }

        const avgDelta = averageMatrix(listDelta);

        // IMPORTANT FIX: avoid empty gradients
        const avgGradients = listGradients.length > 0
            ? averageMatrix(listGradients)
            : null;

        layers.push([avgDelta, avgGradients]);
    }

    return layers;
}
export class Vector {
    constructor(list) {
        this.dimension = list.length
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
        return new Vector(list)
    }
}
export function vectorAddition(a, b) {
    if (a.dimension != b.dimension) {
        throw new Error("vector addition impossible")
    } else {
        let cList = []
        for (let i = 0; i < a.list.length; i++) {
            cList.push(a.list[i] + b.list[i])
        }
        return new Vector(cList)
    }
}
export function matrixAddition(Ma, b) {
    if (Ma.size()[0] != b.size()[0]|| Ma.size()[1] != b.size()[1]) {
        throw new Error("addition impossible")
    }
    else {
        let vectors = []
        for (let a  = 0; a < b.size()[0]; a++) {
            let list = []
            for (let c = 0; c < b.size()[1]; c++) {
                list.push(Ma.rows[a][c] + b.rows[a][c])
            }
            vectors.push(list)
        }
        return new Matrix(vectors)
    }
}
export function matrixOperator(a, func) {
    let vectors = []
    for (let vector of a.rows) {
        let list = []
        for (let old of vector) {
            list.push(func(old))
        }
        vectors.push(list)
    }
    return new Matrix(vectors)
}
export function matrixSubtraction(a, b) {
    let inverseb = matrixOperator(b, n => -n)
    return matrixAddition(a, inverseb)
}
export function matrixMultiplication (a, b) {
    if (a.size()[1] != b.size()[0]) {
        throw new Error("multiplication impossibole")
    } else {
        let size = [a.size()[0], b.size()[1]]
        let matrixList = []
        for (let i = 0; i < size[0]; i++) {
            matrixList.push([])
        }
        for (let  i = 0; i < a.size()[0]; i++) {
            for (let j = 0; j < b.size()[1]; j++) {
                let sum = 0
                for (let k = 0; k < a.size()[1]; k++) {
                    sum += a.rows[i][k] * b.rows[k][j]
                } 
                matrixList[i][j] = sum
            }
        }
        return new Matrix(matrixList)

    }
}
export class Matrix {
    constructor(rows) {
        this.rows = rows;
    }

    size() {
        return [this.rows.length, this.rows[0].length];
    }

    transpose() {
        const [r, c] = this.size();
        let out = [];

        for (let j = 0; j < c; j++) {
            let row = [];
            for (let i = 0; i < r; i++) {
                row.push(this.rows[i][j]);
            }
            out.push(row);
        }
        return new Matrix(out);
    }
}
export class Layer {
    constructor(biases, startingWeigths, endingWeigths) {
        this.biases = biases
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
    activationDerivatives(last) {
        if (last) {
        return matrixOperator(this.activation, n => n*( 1 - n))
        } return matrixOperator(this.activation, n => (n > 0 ? 1 : 0.01))
    }

}
export class Model {
    constructor(layers) {
        this.layers = layers
        this.storage = []
        
    }
    push(value) {
        this.storage.push(value)
    }
    reset() {
        this.storage = []
    }
    forward(input) {
        this.layers[0].activation = new Matrix([input])
        for (let i = 1; i < this.layers.length; i++) {

            let values = this.layers[i -1].activation
            let biases = this.layers[i].biases

            let vectors = []
            let weights = this.layers[i].endingWeigths
            let z = matrixAddition(matrixMultiplication(values,weights), biases)
            if (z.size()[0] != 1) {
                throw new Error("z mismatch size")
            } else {
                this.layers[i].changeZ(z)
                if (i != this.layers.kength -1) {
                this.layers[i].activation = matrixOperator(z, leakyRelu)
                } else {
                    this.layers[i].activation = matrixOperator(z, sigmoid)
                }
                
            }

        }

    }
    cost(output) {
        if (output.length != this.layers[this.layers.length - 1].biases.rows[0].length) {
            console.log(output.length,this.layers[this.layers.length - 1].biases.rows[0].length )
            throw new Error("cost impossible")
        }
        let difference = matrixSubtraction(this.layers[this.layers.length - 1].activation, new Matrix([output]))
        return new Vector(matrixOperator(difference, a => a**2).rows[0]) 
    }
    costGradient(output) {
        if (output.length != this.layers[this.layers.length - 1].biases.rows[0].length) {
            console.log(output.length,this.layers[this.layers.length - 1].biases.rows[0].length )
            throw new Error("cost impossible")
        }
        let difference = matrixSubtraction(this.layers[this.layers.length - 1].activation, new Matrix([output]))
        return new Vector(matrixOperator(difference, a => a*2).rows[0]) 
    }
    backpropagate(output, index) {
        for (let i = this.layers.length - 1; i >=0; i--) {
            if (i == this.layers.length -1) {
                let costGradient = this.costGradient(output)
                let activationDerivatives = this.layers[i].activationDerivatives(i == this.layers.length - 1)

                let deltaVector = vectorElementMultiplication(costGradient,new Vector( activationDerivatives.rows[0]))
                this.layers[i].changeDelta(new Matrix([deltaVector.list]))
            }
            else {
                let matrix = matrixMultiplication(this.layers[i + 1].delta,this.layers[i+1].endingWeigths.transpose())
                let activationDerivatives = this.layers[i].activationDerivatives(i == this.layers.length - 1)

                let deltaVector = vectorElementMultiplication(new Vector(matrix.rows[0]), new Vector(activationDerivatives.rows[0]))
                this.layers[i].changeDelta(new Matrix([deltaVector.list.map(x => [x])]));
            }
        }
        for (let i = 1; i < this.layers.length; i++) {
            let a = this.layers[i - 1].activation
            let gradient = matrixMultiplication(a.transpose(), this.layers[i].delta)
            this.layers[i].changeGradients(gradient)
        }
        this.push({"index" : index,"model": modelToGradients(this)})
        for (let layer of this.layers) {
            layer.delta = undefined
            layer.gradients = undefined
        }
        
    }
    updateValues(learingRate, index) {
        let obj = {}
        for (let element of this.storage) {
            if (element.index == index) {
                obj = element.model
            }
        }
        for (let i = 0; i < this.layers.length; i++) {
            let b = this.layers[i].biases
            let x = new Vector((matrixOperator(obj[i][0], n => n * (-learingRate))).rows[0])
            let newBiases = vectorAddition(new Vector(b.rows[0]), x) 
            this.layers[i].biases = new Matrix([newBiases.list])
            if (i != 0) {
                let xList = []

                for (let vector of obj[i][1].rows) {
                    let newVecList = []
                    for (let value  of vector) {
                        newVecList.push(value * (-learingRate))
                    }
                    xList.push( newVecList)
                }
                let x = new Matrix( xList)
                let w = this.layers[i].endingWeigths
                let values = matrixAddition(w, x)                    
                this.layers[i].endingWeigths = values
            }
        }
    }
       train(epochs, batchSize, inputs, outputs, learningRate) {
            for (let epoch = 0; epoch < epochs; epoch++) {

                let totalLoss = 0;

                for (let i = 0; i < inputs.length; i++) {

                    // 1. forward
                    this.forward(inputs[i]);


                    this.backpropagate(outputs[i], i);

                    totalLoss += this.cost(outputs[i]).list.reduce((a, b) => a + b, 0);

                    // 3. update every batch
                    if ((i + 1) % batchSize === 0 || i === inputs.length - 1) {
                        let models = this.storage
                        this.reset()
                        this.push({"index" : "niga", "model" : averageDeltas(models)})
                        this.updateValues(learningRate, "niga")
                    }

                    console.clear();
                    console.log(
                        `epoch ${epoch + 1}/${epochs}`,
                        `sample ${i + 1}/${inputs.length}`,
                        `loss ${totalLoss / (i + 1)}`,
                        "acc ="+ accuracy(outputs[i], this.layers[this.layers.length - 1].activation.rows[0]).toFixed(2) + "%  " + outputs[i].length
                    );
                }
            }
        }
    predict(input) {
        this.forward(input) 
        console.log(this.layers[this.layers.length - 1].activation.rows[0])
        
    }
    test(inputSize,func, tests) {
        let data = generateInputs(inputSize, tests, func)
        let acc = 0
        for (let i = 0; i < tests; i++) {
            this.forward(data[0][i])
            let output = Number.parseFloat((this.layers[this.layers.length - 1].activation.rows[0][0]).toFixed(data[1][i][0].toString().length > 2 ? data[1][i][0].toString().length- 2 : 2))
            let err = Math.abs(data[1][i][0] - output) / data[1][i][0] * 100
            acc += 100 - err
        }
        console.log((acc / tests ).toFixed(2)+ "%")
    }
    save (name) {
        let model = []
        for (let layer of this.layers) {
            let list = []
            list.push(layer.biases.rows)
            list.push(typeof(layer.endingWeigths) == "undefined" ? undefined : layer.endingWeigths.rows)
            list.push(typeof(layer.startingWeigths) == "undefined" ? undefined : layer.startingWeigths.rows)
            model.push(list)
        }
        saveModel({"model" : model}, name)
        
    }
}
export function loadModel(name) {
    let obj = getModel(name).model
    let layers = []
    for (let layer of obj) {
        layers.push(new Layer(new Matrix(layer[0]), new Matrix(layer[2]), new Matrix(layer[1])))
    }
    return new Model(layers)
}
export function generateModel(layers, neurons) {
    if (layers < 2) {
        throw new Error("too little layers")
    } if (layers !== neurons.length) {
        throw new Error("number mismatch")
    } else {
        let layerList = []
        for (let i = 0; i < layers; i++ ){
            let list = []
            for (let a = 0; a < neurons[i]; a++) {
                list.push(Math.random() * 0.01)
            }
            let biases = new Matrix([list])
            let startingWeigths = []
            if (i != neurons.length - 1) {
                let vectors = []
                for (let a = 0; a <neurons[i]; a++) {
                    let list = []
                    for (let b =0 ; b < neurons[i+1]; b++) {
                        list.push(heInit(neurons[i]))
                    }
                    vectors.push(list)
                }
                startingWeigths = new Matrix(vectors)
                layerList.push(new Layer(biases, startingWeigths, undefined))
            }
            else {
                layerList.push(new Layer(biases, undefined, undefined))
            }
        }
        for (let i = 0; i < layers; i++ ) {
            if (i != 0) {
                layerList[i].endingWeigths = layerList[i-1].startingWeigths
            }
        }
        return new Model(layerList)
    }
}
export function sameSet(a, b) {
    if (a.size !== b.size) return false;
    for (let v of a) {
        if (!b.has(v)) return false;
    }
    return true;
}