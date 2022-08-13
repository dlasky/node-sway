import os from "os";
import type { MsgType, RawMessage } from "types";

const magic = Buffer.from("i3-ipc");

const end = os.endianness();

const writeInt32 = (buf: Buffer, value: number, offset?: number) => {
  if (end === "BE") {
    return buf.writeInt32BE(value, offset);
  }
  return buf.writeInt32LE(value, offset);
};

const readInt32 = (buf: Buffer, offset?: number) => {
  if (end === "BE") {
    return buf.readInt32BE(offset);
  }
  return buf.readInt32LE(offset);
};

//<magic><i32 len><i32 type><msg>

export const writeMessage = (type: MsgType, value: string) => {
  const msg = Buffer.from(value ?? "");
  const len = msg.length;
  const buf = Buffer.alloc(8);
  writeInt32(buf, len);
  writeInt32(buf, type, 4);
  return Buffer.concat([magic, buf, msg]);
};

export const readMessage = (buf: Buffer): RawMessage => {
  if (magic.compare(buf, 0, magic.length) === 0) {
    let lenOffset = magic.length;
    const len = readInt32(buf, lenOffset);
    const typ = readInt32(buf, lenOffset + 4);
    const msg = buf.subarray(lenOffset + 8, len + 6 + 8);
    let data: Record<string, any>;
    try {
      data = JSON.parse(msg.toString());
    } catch (e) {
      data = { unparsable: true };
    }
    return {
      type: typ,
      value: msg.toString(),
      data,
    };
  } else {
    throw new Error("message is missing magic string:" + buf.toString());
  }
};
