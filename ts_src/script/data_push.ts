import { opcodes } from "./constants";
import RawBytes from "./raw_bytes";

export default class DataPush extends RawBytes {
  name: string;
  len: number | undefined;
  stackState: { [key: string]: number };
  delimiter?: number;

  constructor(stackState: any, name: string, len?: number, delimiter?: number) {
    super(stackState, name, len, delimiter);
    this.stackState = stackState;
    this.name = name;
    this.len = len;
    this.delimiter = delimiter;

    if (this.len == undefined && this.delimiter == undefined) {
      throw new Error("Either the length or the delimiter must be defined");
    }
  }

  protected getData(stack: Buffer): Buffer | null {
    let size = stack[this.stackState.cursor];

    let nSize = 0;
    if (size <= opcodes.OP_PUSHDATA4) {
      this.stackState.cursor++;
      if (size < opcodes.OP_PUSHDATA1) {
        nSize = size;
      } else if (size == opcodes.OP_PUSHDATA1) {
        nSize = stack.readIntLE(this.stackState.cursor++, 1);
      } else if (size == opcodes.OP_PUSHDATA2) {
        nSize = stack.readIntLE(this.stackState.cursor++, 2);
      } else {
        nSize = stack.readIntLE(this.stackState.cursor++, 4);
      }
    } else {
      return null;
    }

    let data = stack.subarray(
      this.stackState.cursor,
      this.stackState.cursor + nSize
    );
    this.stackState.cursor += nSize;
    return data;
  }
}
