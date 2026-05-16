import  {Neuron, sigmoid, Weigth, Layer, Model, sameSet, Vector, Matrix, xavier, generateModel, matrixMultiplication, matrixAddition, vectorElementMultiplication, weigthMatrixes, vectorAddition, readGradientsMatrixes, averageMatrix, generateInputs} from "./lib/main.js"
import { clear, push, readFile,  readGradients,  writeGradients} from "./data/main.js"
let a = new Matrix(2, [new Vector(2,[5,8]),new Vector(2,[9,2])])
let b = new Matrix(2, [new Vector(2, [4, 1]), new Vector(2, [3, 2])])
let vecA = new Vector(2, [2, 4])
let vecB = new Vector(2, [2, 2,])
let model = generateModel(4, [4, 16, 16, 1])
let data = generateInputs(4, 800)

model.train(10, 8, data[0], data[1], 0.01)
