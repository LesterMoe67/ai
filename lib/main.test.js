import { test, describe } from 'node:test';
import assert from 'node:assert';
import { sigmoid, Neuron, generateNeurons, generateWeigths, Weigth, Layer,  Model } from './main.js';

describe('sigmoid function', () => {
    test('returns 0.5 for input 0', () => {
        const result = sigmoid(0);
        assert.strictEqual(result, 0.5);
    });

    test('returns value close to 1 for large positive input', () => {
        const result = sigmoid(10);
        assert.ok(result > 0.9999);
        assert.ok(result < 1);
    });

    test('returns value close to 0 for large negative input', () => {
        const result = sigmoid(-10);
        assert.ok(result > 0);
        assert.ok(result < 0.0001);
    });

    test('returns correct value for positive input', () => {
        const result = sigmoid(1);
        const expected = 1 / (1 + Math.pow(Math.E, -1));
        assert.strictEqual(result, expected);
    });

    test('returns correct value for negative input', () => {
        const result = sigmoid(-2);
        const expected = 1 / (1 + Math.pow(Math.E, 2));
        assert.strictEqual(result, expected);
    });

    test('output is always between 0 and 1', () => {
        const testValues = [-100, -10, -1, 0, 1, 10, 100];
        testValues.forEach(val => {
            const result = sigmoid(val);
            assert.ok(0 <= result && result <= 1);
        });
    });
});

describe('Neuron class', () => {
    describe('constructor', () => {
        test('initializes with correct values', () => {
            const neuron = new Neuron(0.5, 0.2, 1);
            assert.strictEqual(neuron.value, 0.5);
            assert.strictEqual(neuron.bias, 0.2);
            assert.strictEqual(neuron.index, 1);
        });
    });

    describe('changeValue method', () => {
        test('updates neuron value', () => {
            const neuron = new Neuron(0.5, 0.2, 1);
            neuron.changeValue(0.8);
            assert.strictEqual(neuron.value, 0.8);
        });
    });

    describe('changeBias method', () => {
        test('updates neuron bias', () => {
            const neuron = new Neuron(0.5, 0.2, 1);
            neuron.changeBias(0.3);
            assert.strictEqual(neuron.bias, 0.3);
        });
    });

    describe('calculateValue method', () => {
        test('correctly computes neuron value with single input', () => {
            const inputNeuron = new Neuron(1, 0, 0);
            const outputNeuron = new Neuron(0, 0, 1);
            const weight = new Weigth(0.5, 0, 1);
            
            outputNeuron.calculateValue([weight], [inputNeuron]);
            
            // Expected: -bias + sigmoid(weight * input_value)
            // = -0 + sigmoid(0.5 * 1) = sigmoid(0.5)
            const expected = sigmoid(0.5);
            assert.strictEqual(outputNeuron.value, expected);
        });

        test('correctly computes neuron value with multiple inputs', () => {
            const inputNeuron1 = new Neuron(1, 0, 0);
            const inputNeuron2 = new Neuron(0.5, 0, 1);
            const outputNeuron = new Neuron(0, 0, 2);
            
            const weight1 = new Weigth(0.5, 0, 2);
            const weight2 = new Weigth(0.3, 1, 2);
            
            outputNeuron.calculateValue([weight1, weight2], [inputNeuron1, inputNeuron2]);
            
            // Expected: -bias + sigmoid(weight1 * input1 + weight2 * input2)
            // = -0 + sigmoid(0.5 * 1 + 0.3 * 0.5) = sigmoid(0.65)
            const expected = sigmoid(0.65);
            assert.strictEqual(outputNeuron.value, expected);
        });

        test('correctly applies bias in calculation', () => {
            const inputNeuron = new Neuron(1, 0, 0);
            const outputNeuron = new Neuron(0, 0.2, 1);
            const weight = new Weigth(0.5, 0, 1);
            
            outputNeuron.calculateValue([weight], [inputNeuron]);
            
            // Expected: -bias + sigmoid(weight * input_value)
            // = -0.2 + sigmoid(0.5)
            const expected = -0.2 + sigmoid(0.5);
            assert.strictEqual(outputNeuron.value, expected);
        });

        test('handles zero weights correctly', () => {
            const inputNeuron = new Neuron(1, 0, 0);
            const outputNeuron = new Neuron(0, 0, 1);
            const weight = new Weigth(0, 0, 1);
            
            outputNeuron.calculateValue([weight], [inputNeuron]);
            
            // Expected: sigmoid(0) = 0.5
            const expected = sigmoid(0);
            assert.strictEqual(outputNeuron.value, expected);
        });

        test('handles negative weights correctly', () => {
            const inputNeuron = new Neuron(1, 0, 0);
            const outputNeuron = new Neuron(0, 0, 1);
            const weight = new Weigth(-2, 0, 1);
            
            outputNeuron.calculateValue([weight], [inputNeuron]);
            
            // Expected: sigmoid(-2)
            const expected = sigmoid(-2);
            assert.strictEqual(outputNeuron.value, expected);
        });
    });
});

describe('generateNeurons function', () => {
    test('creates specified number of neurons', () => {
        let index = 0;
        const indexing = () => index++;
        const neurons = generateNeurons(5, 1, 0, false, indexing);
        
        assert.strictEqual(neurons.length, 5);
    });

    test('creates neurons with correct initial values when not random', () => {
        let index = 0;
        const indexing = () => index++;
        const neurons = generateNeurons(3, 0.7, 0.3, false, indexing);
        
        neurons.forEach(neuron => {
            assert.strictEqual(neuron.value, 0.7);
            assert.strictEqual(neuron.bias, 0.3);
        });
    });

    test('creates neurons with correct indices using provided function', () => {
        let index = 0;
        const indexing = () => index++;
        const neurons = generateNeurons(4, 1, 0, false, indexing);
        
        assert.strictEqual(neurons[0].index, 0);
        assert.strictEqual(neurons[1].index, 1);
        assert.strictEqual(neurons[2].index, 2);
        assert.strictEqual(neurons[3].index, 3);
    });

    test('creates neurons with random values when random is true', () => {
        let index = 0;
        const indexing = () => index++;
        const neurons = generateNeurons(10, 1, 0, true, indexing);
        
        // Check that values are different (probabilistically should be)
        const values = neurons.map(n => n.value);
        const uniqueValues = new Set(values);
        assert.ok(uniqueValues.size > 1);
        
        // Check all values are between 0 and 1 (Math.random() range)
        neurons.forEach(neuron => {
            assert.ok(neuron.value >= 0 && neuron.value < 1);
            assert.ok(neuron.bias >= 0 && neuron.bias < 1);
        });
    });

    test('creates empty array when count is 0', () => {
        let index = 0;
        const indexing = () => index++;
        const neurons = generateNeurons(0, 1, 0, false, indexing);
        
        assert.strictEqual(neurons.length, 0);
    });

    test('each neuron is a Neuron instance', () => {
        let index = 0;
        const indexing = () => index++;
        const neurons = generateNeurons(3, 1, 0, false, indexing);
        
        neurons.forEach(neuron => {
            assert.ok(neuron instanceof Neuron);
        });
    });
});

describe('generateWeigths function', () => {
    test('creates weights between all starting and ending neurons', () => {
        let index = 0;
        const indexing = () => index++;
        
        const startingNeurons = generateNeurons(2, 1, 0, false, indexing);
        const endingNeurons = generateNeurons(3, 1, 0, false, indexing);
        
        const weights = generateWeigths(startingNeurons, endingNeurons, [0.5], false);
        
        // Should create 2 * 3 = 6 weights
        assert.strictEqual(weights.length, 6);
    });

    test('correctly creates weights with single value for all connections', () => {
        let index = 0;
        const indexing = () => index++;
        
        const startingNeurons = generateNeurons(2, 1, 0, false, indexing);
        const endingNeurons = generateNeurons(2, 1, 0, false, indexing);
        
        const weights = generateWeigths(startingNeurons, endingNeurons, [0.5], false);
        
        weights.forEach(weight => {
            assert.strictEqual(weight.value, 0.5);
        });
    });

    test('correctly creates weights with individual values', () => {
        let index = 0;
        const indexing = () => index++;
        
        const startingNeurons = generateNeurons(2, 1, 0, false, indexing);
        const endingNeurons = generateNeurons(2, 1, 0, false, indexing);
        
        const values = [0.1, 0.2, 0.3, 0.4];
        const weights = generateWeigths(startingNeurons, endingNeurons, values, false);
        
        assert.strictEqual(weights[0].value, 0.1);
        assert.strictEqual(weights[1].value, 0.2);
        assert.strictEqual(weights[2].value, 0.3);
        assert.strictEqual(weights[3].value, 0.4);
    });

    test('creates weights with correct starting and ending indices', () => {
        let index = 0;
        const indexing = () => index++;
        
        const startingNeurons = generateNeurons(2, 1, 0, false, indexing);
        const endingNeurons = generateNeurons(2, 1, 0, false, indexing);
        
        const weights = generateWeigths(startingNeurons, endingNeurons, [0.5], false);
        
        // Expected connections:
        // starting[0] -> ending[0], starting[0] -> ending[1]
        // starting[1] -> ending[0], starting[1] -> ending[1]
        assert.strictEqual(weights[0].starting, startingNeurons[0].index);
        assert.strictEqual(weights[0].ending, endingNeurons[0].index);
        assert.strictEqual(weights[1].starting, startingNeurons[0].index);
        assert.strictEqual(weights[1].ending, endingNeurons[1].index);
        assert.strictEqual(weights[2].starting, startingNeurons[1].index);
        assert.strictEqual(weights[2].ending, endingNeurons[0].index);
        assert.strictEqual(weights[3].starting, startingNeurons[1].index);
        assert.strictEqual(weights[3].ending, endingNeurons[1].index);
    });

    test('creates random weights when random is true', () => {
        let index = 0;
        const indexing = () => index++;
        
        const startingNeurons = generateNeurons(2, 1, 0, false, indexing);
        const endingNeurons = generateNeurons(3, 1, 0, false, indexing);
        
        const weights = generateWeigths(startingNeurons, endingNeurons, [0.5], true);
        
        // Check that values are different (probabilistically should be)
        const values = weights.map(w => w.value);
        const uniqueValues = new Set(values);
        assert.ok(uniqueValues.size > 1);
        
        // Random values should be in range [-5, 5]
        weights.forEach(weight => {
            assert.ok(weight.value >= -5 && weight.value <= 5);
        });
    });

    test('each weight is a Weigth instance', () => {
        let index = 0;
        const indexing = () => index++;
        
        const startingNeurons = generateNeurons(2, 1, 0, false, indexing);
        const endingNeurons = generateNeurons(2, 1, 0, false, indexing);
        
        const weights = generateWeigths(startingNeurons, endingNeurons, [0.5], false);
        
        weights.forEach(weight => {
            assert.ok(weight instanceof Weigth);
        });
    });
});

describe('Weigth class', () => {
    describe('constructor', () => {
        test('correctly initializes with value, starting, and ending', () => {
            const weight = new Weigth(0.5, 0, 1);
            
            assert.strictEqual(weight.value, 0.5);
            assert.strictEqual(weight.starting, 0);
            assert.strictEqual(weight.ending, 1);
        });

        test('correctly initializes with negative value', () => {
            const weight = new Weigth(-2.5, 3, 4);
            
            assert.strictEqual(weight.value, -2.5);
            assert.strictEqual(weight.starting, 3);
            assert.strictEqual(weight.ending, 4);
        });

        test('correctly initializes with zero value', () => {
            const weight = new Weigth(0, 1, 2);
            
            assert.strictEqual(weight.value, 0);
        });
    });

    describe('changeValue method', () => {
        test('updates weight value correctly', () => {
            const weight = new Weigth(0.5, 0, 1);
            
            weight.changeValue(0.8);
            assert.strictEqual(weight.value, 0.8);
        });

        test('updates weight value to negative correctly', () => {
            const weight = new Weigth(0.5, 0, 1);
            
            weight.changeValue(-1.5);
            assert.strictEqual(weight.value, -1.5);
        });

        test('updates weight value to zero correctly', () => {
            const weight = new Weigth(0.5, 0, 1);
            
            weight.changeValue(0);
            assert.strictEqual(weight.value, 0);
        });

        test('does not modify starting or ending indices', () => {
            const weight = new Weigth(0.5, 2, 3);
            
            weight.changeValue(1.0);
            assert.strictEqual(weight.starting, 2);
            assert.strictEqual(weight.ending, 3);
        });
    });
});

