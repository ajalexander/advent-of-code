import { FileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

interface PositionState {
    readonly horizontal: number;
    readonly depth: number;

    forward(amount: number): PositionState;
    up(amount: number): PositionState;
    down(amount: number): PositionState;
}

class BasicPositionState implements PositionState {
    readonly horizontal: number;
    readonly depth: number;
    constructor(horizontal = 0, depth = 0) {
        this.horizontal = horizontal;
        this.depth = depth;
    }

    forward(amount: number) {
        return new BasicPositionState(this.horizontal + amount, this.depth);
    }

    up(amount: number) {
        return new BasicPositionState(this.horizontal, this.depth - amount);
    }

    down(amount: number) {
        return new BasicPositionState(this.horizontal, this.depth + amount);
    }
}

class AimedPositionState implements PositionState {
    readonly horizontal: number;
    readonly depth: number;
    readonly aim: number;
    constructor(horizontal = 0, depth = 0, aim = 0) {
        this.horizontal = horizontal;
        this.depth = depth;
        this.aim = aim;
    }

    forward(amount: number) {
        return new AimedPositionState(this.horizontal + amount, this.depth + this.aim * amount, this.aim);
    }

    up(amount: number) {
        return new AimedPositionState(this.horizontal, this.depth, this.aim - amount);
    }

    down(amount: number) {
        return new AimedPositionState(this.horizontal, this.depth, this.aim + amount);
    }
}

export class Solution extends FileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 2;
    }

    partOne(): void {
        this.runSimulation(new BasicPositionState());
    }

    partTwo(): void {
        this.runSimulation(new AimedPositionState());
    }

    private runSimulation(position: PositionState) {
        this.inputLines.forEach(instruction => {
            const [direction, amount] = instruction.split(' ');
            const parsedAmount = parseInt(amount);
            switch (direction) {
                case 'forward':
                    position = position.forward(parsedAmount);
                    break;
                case 'up':
                    position = position.up(parsedAmount);
                    break;
                case 'down':
                    position = position.down(parsedAmount);
                    break;
            }
        });

        console.log(`Final position - horizontal: ${position.horizontal}, vertical: ${position.depth}`);
        console.log(`Position sun: ${position.horizontal * position.depth}`);
    }
}
