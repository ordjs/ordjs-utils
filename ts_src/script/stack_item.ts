export default interface StackItem {
  name: string;
  parseFromStack(stack: Buffer): Buffer;
}
