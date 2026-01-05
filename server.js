import  {Neuron, sigmoid, Weigth, generateNeurons, generateWeigths} from "./lib/main.js"
let n = 0
function indexing() {
    n++
    return n
}
let list = generateNeurons(4, 1, 0, false, indexing)
let test = new Neuron(0, 0, indexing())
let weigths = generateWeigths(list, [test], [1 / 4], false)
test.calculateValue(weigths, list)
test.verbose()
