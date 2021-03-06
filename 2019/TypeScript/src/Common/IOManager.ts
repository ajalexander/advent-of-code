import * as readlineSync from 'readline-sync';

export interface IOManager {
  input() : number | undefined;
  output(value: number);
}

export class InMemoryBufferIOManager implements IOManager {
  inputBuffer : number[];
  outputBuffer : number[];

  inputRecievedCallback : (value: number) => void;
  outputProvidedCallback : (value: number) => void;

  constructor() {
    this.inputBuffer = [];
    this.outputBuffer = [];
  }
  
  reset() {
    this.inputBuffer = [];
    this.outputBuffer = [];
  }

  addToInputBuffer(value: number) {
    this.inputBuffer.push(value);
  }

  input() : number | undefined {
    const value = this.inputBuffer.shift();
    // console.log(`Returning ${value} as an input`);
    return value;
  }

  output(value: number) {
    // console.log(`Storing ${value} as an output`);
    this.outputBuffer.push(value);
  }
}

export class ChainedIOManager extends InMemoryBufferIOManager {
  feeder: ChainedIOManager;

  constructor(feeder: ChainedIOManager = null) {
    super();
    this.feeder = feeder;
  }

  hasAvailableOutput() {
    return this.outputBuffer.length > 0;
  }

  takeOutput() : number {
    return this.outputBuffer.shift();
  }

  input() : number | undefined {
    let value: number = undefined;

    if (this.inputBuffer.length > 0) {
      value = super.input();
    } else if (this.feeder.hasAvailableOutput()) {
      value = this.feeder.takeOutput();
      // console.log(`Returning ${value} as an input (from the output buffer)`);
    }

    return value;
  }
}

export class CommandLineIOManager implements IOManager {
  private standardInput = process.stdin;

  constructor() {
    this.standardInput.setEncoding('utf-8');
  }

  input() : number {
    return readlineSync.questionInt('Input Value: ');
  }

  output(value: number) {
    console.log(`Output Value: ${value}`);
  }
}
