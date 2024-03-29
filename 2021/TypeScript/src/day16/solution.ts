import { FileBasedProblemBase } from "../common/problemBase";

// const inputFile = 'example.txt';
const inputFile = 'problem.txt';

const inputPath = `${__dirname}/${inputFile}`;

enum PacketType {
    sum = 0,
    product = 1,
    minimum = 2,
    maximum = 3,
    literal = 4,
    greaterThan = 5,
    lessThan = 6,
    equalTo = 7,
}

const versionLength = 3;
const typeLength = 3;
const numberPartLength = 5;
const toReadLength = 15;
const containedPacketsLength = 11;

class PacketResult {
    readonly version: number;
    readonly type: PacketType;
    readonly processedBits: number;
    readonly depth: number;
    readonly directResult?: number
    readonly innerResults?: PacketResult[];

    constructor(version: number, type: PacketType, processedBits: number, depth: number, directResult?: number, innerResults?: PacketResult[]) {
        this.version = version;
        this.type = type;
        this.processedBits = processedBits;
        this.depth = depth;
        this.directResult = directResult;
        this.innerResults = innerResults;
    }

    combinedVersion(): number {
        let combined = this.version;

        if (this.innerResults) {
            this.innerResults.forEach(inner => combined += inner.combinedVersion());
        }

        return combined;
    }

    calculatedValue(): number {
        if (this.innerResults) {
            switch (this.type) {
                case PacketType.sum:
                    {
                        return this.innerResults.map(result => result.calculatedValue()).reduce((prev, curr) => prev + curr, 0);
                    }
                    case PacketType.product:
                    {
                        return this.innerResults.map(result => result.calculatedValue()).reduce((prev, curr) => prev * curr, 1);
                    }
                    case PacketType.minimum:
                    {
                        return this.innerResults.map(result => result.calculatedValue()).sort((a, b) => a - b)[0];
                    }
                    case PacketType.maximum:
                    {
                        return this.innerResults.map(result => result.calculatedValue()).sort((a, b) => b - a)[0];
                    }
                    case PacketType.greaterThan:
                    {
                        return this.innerResults[0].calculatedValue() > this.innerResults[1].calculatedValue() ? 1 : 0;
                    }
                    case PacketType.lessThan:
                    {
                        return this.innerResults[0].calculatedValue() < this.innerResults[1].calculatedValue() ? 1 : 0;
                    }
                    case PacketType.equalTo:
                    {
                        return this.innerResults[0].calculatedValue() === this.innerResults[1].calculatedValue() ? 1 : 0;
                    }
            }

            return -1;
        }
        else if (this.directResult) {
            return this.directResult;
        } else {
            return NaN;
        }
    }
}

const convertHexToBinary = (line: string) => {
    return line.split('').map(character => parseInt(character, 16).toString(2).padStart(4, '0')).join('');
}

const parseLiteral = (remainder: string) => {
    let done = false;
    let numberString = '';
    let currentIndex = 0;
    
    while (!done) {
        const piece = remainder.substring(currentIndex, currentIndex + numberPartLength);
        const numberPart = piece.substring(1);
        numberString += numberPart;

        currentIndex += numberPartLength;
        done = piece[0] === '0';
    }
    
    const parsedNumber = parseInt(numberString, 2);

    return {
        value: parsedNumber,
        processedBits: currentIndex
    };
}

const parseSubPackets = (packet: string, nextDepth: number) => {
    let currentIndex = 0;
    const subPacketResults: PacketResult[] = [];

    let remainder: string;
    let doneFunction: () => boolean;
    let headerBits = 1;
    if (packet[0] === '0') {
        const lengthToRead = parseInt(packet.substring(1, 1 + toReadLength), 2);
        remainder = packet.substring(1 + toReadLength);
        doneFunction = () => currentIndex === lengthToRead;
        headerBits += toReadLength;
    } else {
        const containedSubPackets = parseInt(packet.substring(1, 1 + containedPacketsLength), 2);
        remainder = packet.substring(1 + containedPacketsLength);
        doneFunction = () => subPacketResults.length === containedSubPackets;
        headerBits += containedPacketsLength;
    }

    while (!doneFunction()) {
        const subPacket = remainder.substring(currentIndex);
        const subPacketResult = parsePacket(subPacket, nextDepth);
        subPacketResults.push(subPacketResult);
        currentIndex += subPacketResult.processedBits;
    }

    return {
        headerBits,
        subPacketResults,
    };
}

const parsePacket = (packet: string, depth: number): PacketResult => {
    const version = parseInt(packet.substring(0, versionLength), 2);
    const type = parseInt(packet.substring(versionLength, versionLength + typeLength), 2);

    const remainder = packet.substring(versionLength + typeLength);

    if (type === PacketType.literal) {
        const literalResult = parseLiteral(remainder);
        const result = literalResult.value;
        const processedBits =  versionLength + typeLength + literalResult.processedBits;
        return new PacketResult(version, type, processedBits, depth, result);
    } else {
        const innerResults = parseSubPackets(remainder, depth + 1);
        const processedBits = versionLength + typeLength + innerResults.headerBits + innerResults.subPacketResults.map(r => r.processedBits).reduce((prev, curr) => prev + curr, 0);
        return new PacketResult(version, type, processedBits, depth, undefined, innerResults.subPacketResults);
    }
}

const parse = (packet: string): PacketResult => {
    const converted = convertHexToBinary(packet);
    return parsePacket(converted, 0);
}

export class Solution extends FileBasedProblemBase {
    constructor() {
        super(inputPath);
    }

    day(): number {
        return 16;
    }

    partOne(): void {
        this.inputLines.forEach(line => {
            const result = parse(line);
            const combinedVersion = result.combinedVersion();

            console.log(`The combined version for ${line} is ${combinedVersion}`);
        });
    }

    partTwo(): void {
        this.inputLines.forEach(line => {
            const result = parse(line);

            console.log(`The calculated value for ${line} is ${result.calculatedValue()}`);
        });
    }
}
