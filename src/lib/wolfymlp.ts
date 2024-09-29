class Neuron {
    public weights: number[];
    public bias: number;
    public output: number;
    private learningRate: number;

    constructor(inputSize: number, learningRate: number = 0.01) {
        this.weights = Array.from({ length: inputSize }, () => Math.random() * 0.1 - 0.05);
        this.bias = Math.random() * 0.1 - 0.05;
        this.learningRate = learningRate;
        this.output = 0;
    }

    // Activation function (Sigmoid)
    activate(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    // Derivative of the activation function
    activateDerivative(x: number): number {
        return x * (1 - x); // x is the output from the activate function
    }

    // Forward pass
    forward(inputs: number[]): number {
        const sum = this.weights.reduce((acc, weight, index) => acc + weight * inputs[index], this.bias);
        this.output = this.activate(sum);
        return this.output;
    }

    // Update weights based on the error
    updateWeights(inputs: number[], error: number) {
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] += this.learningRate * error * inputs[i];
        }
        this.bias += this.learningRate * error; // Update bias as well
    }
}

export class WolfyMLP {
    private layers: Neuron[][];

    constructor(layerSizes: number[], private learningRate: number = 0.01) {
        this.layers = [];
        for (let i = 0; i < layerSizes.length; i++) {
            const layer: Neuron[] = [];
            const inputSize = i === 0 ? 0 : layerSizes[i - 1];
            for (let j = 0; j < layerSizes[i]; j++) {
                layer.push(new Neuron(inputSize, this.learningRate));
            }
            this.layers.push(layer);
        }
    }

    // Training method
    train(inputs: number[], target: number) {
        const outputs = [inputs];
        // Forward pass
        for (const layer of this.layers) {
            const layerOutputs = layer.map(neuron => neuron.forward(outputs[outputs.length - 1]));
            outputs.push(layerOutputs);
        }

        // Calculate error at output layer
        const outputLayer = outputs[outputs.length - 1];
        const error = target - outputLayer[0];

        // Backward pass
        for (let i = this.layers.length - 1; i >= 0; i--) {
            const layer = this.layers[i];
            const layerOutputs = outputs[i + 1];

            for (let j = 0; j < layer.length; j++) {
                const neuron = layer[j];
                const output = layerOutputs[j];

                let localError: number;
                if (i === this.layers.length - 1) {
                    localError = error * neuron.activateDerivative(neuron.output); // Using neuron output directly
                } else {
                    const nextLayer = this.layers[i + 1];
                    localError = neuron.activateDerivative(neuron.output) * nextLayer.reduce((acc, nextNeuron) => acc + nextNeuron.weights[j] * nextNeuron.output, 0);
                }

                neuron.updateWeights(outputs[i], localError);
            }
        }
    }

    // Prediction method
    predict(inputs: number[]): number {
        let currentInput = inputs;
        for (const layer of this.layers) {
            currentInput = layer.map(neuron => neuron.forward(currentInput));
        }
        return currentInput[0]; // Return the output of the first neuron in the last layer
    }

    // Get weights for inspection
    getWeights(): number[][][] {
        return this.layers.map(layer => layer.map(neuron => neuron.weights));
    }
}

// Example usage
const mlp = new WolfyMLP([3, 5, 1]); // 3 inputs, 5 neurons in hidden layer, 1 output

// Training
for (let i = 0; i < 1000; i++) {
    mlp.train([0.5, 0.2, 0.1], 1); // Training on some example data
    mlp.train([0.1, 0.4, 0.6], 0); // More training data
}

// Prediction
const prediction = mlp.predict([0.4, 0.7, 0.1]); // Making a prediction
console.log("Prediction:", prediction);
console.log("Weights of the input layer:", mlp.getWeights()[0]); // Show weights of the first layer
