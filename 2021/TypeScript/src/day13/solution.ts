import { GroupedFileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

enum FoldType {
    up,
    left
}

interface FoldInstruction {
    type: FoldType;
    position: number;
}

interface Position {
    x: number;
    y: number;
}

class PaperState {
    readonly width: number;
    readonly height: number;
    readonly markedPositions: Position[];

    constructor(markedPositions: Position[], width: number, height: number) {
        this.markedPositions = markedPositions;
        this.width = width;
        this.height = height;
    }

    print() {
        console.log(`Currently a ${this.width} x ${this.height} grid...`)
        console.log();
        for (let y = 0; y < this.height; y += 1) {
            let line = '';
            for (let x = 0; x < this.width; x += 1) {
                line += this.isMarked(x, y) ? '#' : '.';
            }
            console.log(line);
        }
        console.log();
        console.log();
    }

    fold(instruction: FoldInstruction) {
        if (instruction.type === FoldType.up) {
            return this.foldedPositions(
                position => position.x,
                position => this.calculateShifts(instruction.position, position.y),
                this.width,
                this.height - instruction.position
            );
        } else {
            return this.foldedPositions(
                position => this.calculateShifts(instruction.position, position.x),
                position => position.y,
                this.width - instruction.position,
                this.height
            );
        }
    }

    private calculateShifts(foldPoint: number, target: number) {
        if (target === foldPoint) {
            return target;
        }
        
        if (target < foldPoint) {
            return target;
        }

        return foldPoint - (target - foldPoint);
    }

    private foldedPositions(xShift: (position: Position) => number, yShift: (position: Position) => number, newWidth: number, newHeight: number) {
        const newPositions: Position[] = [];
    
        this.markedPositions.forEach(position => {
            const newPosition = {
                x: xShift(position),
                y: yShift(position),
            } as Position;

            if (!newPositions.some(other => other.x === newPosition.x && other.y === newPosition.y)) {
                newPositions.push(newPosition);
            }
        });

        return new PaperState(newPositions, newWidth, newHeight);
    }

    private isMarked(x: number, y: number) {
        return this.markedPositions.some(position => position.x === x && position.y === y);
    }
}

const parsePaperState = (inputLines: string[]) => {
    const markedPositions = inputLines.map(line => {
        const [x, y] = line.split(',');
        return {
            x: parseInt(x),
            y: parseInt(y),
        } as Position;
    });

    const width = markedPositions.map(position => position.x).sort((a, b) => b - a)[0];
    const height = markedPositions.map(position => position.y).sort((a, b) => b - a)[0];

    return new PaperState(markedPositions, width, height);
}

const parseFoldInstructions = (inputLines: string[]) => {
    return inputLines.map(line => {
        const [axis, value] = line.substring(11).split('=');
        const type = axis === 'x' ? FoldType.left : FoldType.up;
        const position = parseInt(value);

        return {
            type,
            position,
        } as FoldInstruction;
    });
};

const parseInputs = (groups: string[][]) => {
    return {
        paperState: parsePaperState(groups[0]),
        instructions: parseFoldInstructions(groups[1])
    };
};

export class Solution extends GroupedFileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 13;
    }

    partOne(): void {
        const parsed = parseInputs(this.inputGroups);
        let state = parsed.paperState;

        state = state.fold(parsed.instructions[0]);

        console.log(`After 1 fold there are ${state.markedPositions.length} visible dots`);
    }

    partTwo(): void {
        const parsed = parseInputs(this.inputGroups);
        let state = parsed.paperState;

        parsed.instructions.forEach(instruction => state = state.fold(instruction));

        state.print();

    }
}
