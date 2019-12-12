import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';

import { CodeProcessor } from './CodeProcessor';
import { IOManager } from './IOManager';

describe('CodeProcessor', () => {
  let processor;
  let ioManager;

  beforeEach(() => {
    ioManager = sinon.createStubInstance(IOManager);
    processor = new CodeProcessor(ioManager);
  });

  describe('processCodes', () => {
    it('should handle empty array', () => {
      expect(processor.processCodes([])).to.eql([]);
    });

    it('should handle addition operation', () => {
      expect(processor.processCodes([1, 4, 5, 6, 7, 8, 0])).to.eql([1, 4, 5, 6, 7, 8, 15]);
    });

    it('should handle multiplication operation', () => {
      expect(processor.processCodes([2, 4, 5, 6, 7, 8, 0])).to.eql([2, 4, 5, 6, 7, 8, 56]);
    });

    it('should handle input operation', () => {
      ioManager.input.returns(27);
      expect(processor.processCodes([3, 1])).to.eql([3, 27]);
    });

    it('should handle output operation', () => {
      expect(processor.processCodes([4, 2, 44])).to.eql([4, 2, 44]);
      sinon.assert.calledWithExactly(ioManager.output, 44);
    });

    it('should handle less than operation (true)', () => {
      expect(processor.processCodes([7, 4, 5, 6, 17, 18, 0])).to.eql([7, 4, 5, 6, 17, 18, 1]);
    });

    it('should handle less than operation (false)', () => {
      expect(processor.processCodes([7, 4, 5, 6, 17, 17, 0])).to.eql([7, 4, 5, 6, 17, 17, 0]);
    });

    it('should handle equals operation (true)', () => {
      expect(processor.processCodes([8, 4, 5, 6, 17, 18, 0])).to.eql([8, 4, 5, 6, 17, 18, 0]);
    });

    it('should handle equals operation (false)', () => {
      expect(processor.processCodes([8, 4, 5, 6, 17, 17, 0])).to.eql([8, 4, 5, 6, 17, 17, 1]);
    });

    it('should handle jump if true (true)', () => {
      expect(processor.processCodes([1105, 1, 7, 0, 0, 1101, 30, 20, 0])).to.eql([1105, 1, 7, 0, 0, 1101, 30, 20, 0]);
    });

    it('should handle jump if true (false)', () => {
      expect(processor.processCodes([105, 0, 6, 20, 0, 1101, 1, 2, 0])).to.eql([3, 0, 6, 20, 0, 1101, 1, 2, 0]);
    });

    it('should handle jump if false (true)', () => {
      expect(processor.processCodes([1106, 0, 7, 0, 0, 1101, 30, 20, 0])).to.eql([1106, 0, 7, 0, 0, 1101, 30, 20, 0]);
    });

    it('should handle jump if false (false)', () => {
      expect(processor.processCodes([106, -1, 6, 20, 0, 1101, 1, 2, 0])).to.eql([3, -1, 6, 20, 0, 1101, 1, 2, 0]);
    });

    it('should stop at halt operation', () => {
      expect(processor.processCodes([99, 2, 5, 6, 7, 8, 9, 0])).to.eql([99, 2, 5, 6, 7, 8, 9, 0]);
    });

    it('should handle immediate mode for addition', () => {
      expect(processor.processCodes([1101, 4, 5, 4, 0])).to.eql([1101, 4, 5, 4, 9]);
    });

    it('should handle immediate mode for multiplication', () => {
      expect(processor.processCodes([1102, -2, 5, 4, 0])).to.eql([1102, -2, 5, 4, -10]);
    });

    it('should handle immediate mode output operation', () => {
      expect(processor.processCodes([104, 2, 44])).to.eql([104, 2, 44]);
      sinon.assert.calledWithExactly(ioManager.output, 2);
    });

    it('should handle example 1', () => {
      expect(processor.processCodes([1, 0, 0, 0, 99])).to.eql([2, 0, 0, 0, 99]);
    });

    it('should handle example 2', () => {
      expect(processor.processCodes([2, 3, 0, 3, 99])).to.eql([2, 3, 0, 6, 99]);
    });

    it('should handle example 3', () => {
      expect(processor.processCodes([2, 4, 4, 5, 99, 0])).to.eql([2, 4, 4, 5, 99, 9801]);
    });

    it('should handle example 4', () => {
      expect(processor.processCodes([1, 1, 1, 4, 99, 5, 6, 0, 99])).to.eql([30, 1, 1, 4, 2, 5, 6, 0, 99]);
    });

    it('should handle example 5', () => {
      expect(processor.processCodes([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50])).to.eql([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
    });

    it('should handle example 6', () => {
      expect(processor.processCodes([1002, 4, 3, 4, 33])).to.eql([1002, 4, 3, 4, 99]);
    });

    describe('io examples', () => {
      describe('position mode', () => {
        it('equals mode (true)', () => {
          ioManager.input.returns(8);
          processor.processCodes([3,9,8,9,10,9,4,9,99,-1,8]);
          sinon.assert.calledWithExactly(ioManager.output, 1);
        });
  
        it('equals mode (false)', () => {
          ioManager.input.returns(39);
          processor.processCodes([3,9,8,9,10,9,4,9,99,-1,8]);
          sinon.assert.calledWithExactly(ioManager.output, 0);
        });

        it('less than mode (true)', () => {
          ioManager.input.returns(7);
          processor.processCodes([3,9,7,9,10,9,4,9,99,-1,88]);
          sinon.assert.calledWithExactly(ioManager.output, 1);
        });
  
        it('less than mode (false)', () => {
          ioManager.input.returns(8);
          processor.processCodes([3,9,7,9,10,9,4,9,99,-1,8]);
          sinon.assert.calledWithExactly(ioManager.output, 0);
        });

        it('jump mode (should output 0)', () => {
          ioManager.input.returns(0);
          processor.processCodes([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9]);
          sinon.assert.calledWithExactly(ioManager.output, 0);
        });

        it('jump mode (should output 1)', () => {
          ioManager.input.returns(1);
          processor.processCodes([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9]);
          sinon.assert.calledWithExactly(ioManager.output, 1);
        });
      });

      describe('immediate mode', () => {
        it('equals mode (true)', () => {
          ioManager.input.returns(8);
          processor.processCodes([3,3,1108,-1,8,3,4,3,99]);
          sinon.assert.calledWithExactly(ioManager.output, 1);
        });
  
        it('equals mode (false)', () => {
          ioManager.input.returns(39);
          processor.processCodes([3,3,1108,-1,8,3,4,3,99]);
          sinon.assert.calledWithExactly(ioManager.output, 0);
        });

        it('less than mode (true)', () => {
          ioManager.input.returns(7);
          processor.processCodes([3,3,1107,-1,8,3,4,3,99]);
          sinon.assert.calledWithExactly(ioManager.output, 1);
        });
  
        it('less than mode (false)', () => {
          ioManager.input.returns(8);
          processor.processCodes([3,3,1107,-1,8,3,4,3,99]);
          sinon.assert.calledWithExactly(ioManager.output, 0);
        });

        it('jump mode (should output 0)', () => {
          ioManager.input.returns(0);
          processor.processCodes([3,3,1105,-1,9,1101,0,0,12,4,12,99,1]);
          sinon.assert.calledWithExactly(ioManager.output, 0);
        });

        it('jump mode (should output 1)', () => {
          ioManager.input.returns(1);
          processor.processCodes([3,3,1105,-1,9,1101,0,0,12,4,12,99,1]);
          sinon.assert.calledWithExactly(ioManager.output, 1);
        });
      });

      describe('bigger example', () => {
        it('should output 999 when input < 8', () => {
          ioManager.input.returns(7);
          processor.processCodes([3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99]);
          sinon.assert.calledWithExactly(ioManager.output, 999);
        });

        it('should output 1000 when input == 8', () => {
          ioManager.input.returns(8);
          processor.processCodes([3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99]);
          sinon.assert.calledWithExactly(ioManager.output, 1000);
        });

        it('should output 1001 when input > 8', () => {
          ioManager.input.returns(9);
          processor.processCodes([3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99]);
          sinon.assert.calledWithExactly(ioManager.output, 1001);
        });
      });
    });
  });
});