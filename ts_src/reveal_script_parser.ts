import { opcodes } from "./script/constants";
import DataPush from "./script/data_push";
import Opcode from "./script/opcode";
import RawBytes from "./script/raw_bytes";

export default class RevealScriptParser {
  parse(stack: Buffer | string) {
    if (typeof stack == "string") {
      stack = Buffer.from(stack, "hex");
    }

    let stackState = {
      cursor: 0,
    };

    let BODY_DELIMITER = 0;
    let sequence: any = [
      new DataPush(stackState, "PUBKEY", 32),
      new Opcode(stackState, "CHECK_SIG", opcodes.CHECK_SIG),
      new Opcode(stackState, "OP_FALSE", opcodes.OP_FALSE),
      new Opcode(stackState, "OP_IF", opcodes.OP_IF),
      new DataPush(stackState, "ORD_PROTOCOL_ID", 3),
      new DataPush(stackState, "CONTENT_TYPE_DELIMITER", 1),
      new DataPush(stackState, "CONTENT_TYPE", undefined, BODY_DELIMITER),
      new DataPush(stackState, "BODY_DELIMITER", 0),
      new DataPush(stackState, "BODY", undefined, opcodes.OP_ENDIF),
      new RawBytes(stackState, "EXTRA_DATA", undefined, opcodes.OP_ENDIF),
      new Opcode(stackState, "END_IF", opcodes.OP_ENDIF),
    ];

    let revealScript: { [key: string]: Buffer } = {};

    for (let stackItem of sequence) {
      revealScript[stackItem.name] = stackItem.parseFromStack(stack);
    }

    return revealScript;
  }
}
