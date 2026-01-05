import  {Neuron, sigmoid, Weigth, generateNeurons, generateWeigths, Layer, Model} from "./lib/main.js"
let n = 0
function indexing() {
    n++
    return n
}
let lists = [generateNeurons(2, 0, 0, true, indexing), generateNeurons(16, 0, 0, true, indexing), generateNeurons(16, 0, 0, true, indexing), generateNeurons(1, 0, 0, true, indexing)]
let weights = [generateWeigths(lists[0], lists[1], 0, true), generateWeigths(lists[1], lists[2], 0, true), generateWeigths(lists[2], lists[3], 0, true)]
let starting = new Layer(lists[0], [], weights[0])
let first = new Layer(lists[1], weights[0], weights[1])
let second = new Layer(lists[2], weights[1], weights[2])
let last = new Layer(lists[3], weights[2], [])
let model = new Model([starting, first, second, last])
let list = model.execute([1, 3])
list[0].verbose()