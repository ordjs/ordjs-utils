import StackItem from "./stack_item";

export default class Opcode implements StackItem {
  stackState: any;
  name: string;
  value: number;

  constructor(stackState: any, name: string, value: number) {
    this.stackState = stackState;
    this.name = name;
    this.value = value;
  }

  parseFromStack(stack: Buffer): Buffer {
    if (stack[this.stackState.cursor++] != this.value) {
      let errorMessage = `Error at position ${this.stackState.cursor}:`;

      let expectedValue = this.value;
      let expectedOpcode = this.name;
      errorMessage += ` Expected 0x${expectedValue.toString(
        16
      )} (${expectedOpcode})`;

      errorMessage += `, Got 0x${stack[this.stackState.cursor - 1]?.toString(
        16
      )}`;

      throw new Error(errorMessage);
    }

    return Buffer.from([this.value]);
  }
}
