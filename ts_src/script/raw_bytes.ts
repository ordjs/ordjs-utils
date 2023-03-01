import StackItem from "./stack_item";

export default class RawBytes implements StackItem {
  name: string;
  len: number | undefined;
  stackState: { [key: string]: number };
  delimiter?: number;

  constructor(stackState: any, name: string, len?: number, delimiter?: number) {
    this.stackState = stackState;
    this.name = name;
    this.len = len;
    this.delimiter = delimiter;

    if (this.len == undefined && this.delimiter == undefined) {
      throw new Error("Either the length or the delimiter must be defined");
    }
  }

  public parseFromStack(stack: Buffer) {
    let chunks: Buffer[] = [];
    let chunk: Buffer | null;

    let bytesRead = 0;

    while ((chunk = this.getData(stack))) {
      chunks.push(chunk);
      bytesRead += chunk.length;

      if (
        this.enforceDataLength(bytesRead, this.len) ||
        stack[this.stackState.cursor] == this.delimiter
      ) {
        break;
      }
    }

    this.enforceDataLength(bytesRead, this.len);
    return Buffer.concat(chunks);
  }

  protected enforceDataLength(
    bytesRead: number,
    nextExpectedStackElementLen?: number
  ): boolean {
    if (nextExpectedStackElementLen == undefined) {
      return false;
    }

    if (bytesRead > nextExpectedStackElementLen) {
      throw new Error(
        `Error at byte ${this.stackState.cursor}: Read more data than expected`
      );
    }

    if (bytesRead == nextExpectedStackElementLen) {
      return true;
    }

    return false;
  }

  protected getData(stack: Buffer): Buffer | null {
    return stack.subarray(this.stackState.cursor, ++this.stackState.cursor);
  }
}
