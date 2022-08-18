import os from "os";
import { EventType, MsgType, RawMessage } from "./types";

const magic = Buffer.from("i3-ipc");

const end = os.endianness();

const writeInt32 = (buf: Buffer, value: number, offset?: number) => {
  if (end === "BE") {
    return buf.writeUInt32BE(value, offset);
  }
  return buf.writeUInt32LE(value, offset);
};

const readInt32 = (buf: Buffer, offset?: number) => {
  if (end === "BE") {
    return buf.readUInt32BE(offset);
  }
  return buf.readUInt32LE(offset);
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

export const readMessage = (buf: Buffer, offset:number = 0 ): RawMessage => {
  if (magic.compare(buf, offset, offset+magic.length) === 0) {
    let lenOffset = offset + magic.length;
    const len = readInt32(buf, lenOffset);
    lenOffset+=4
    const typ = readInt32(buf, lenOffset);
    lenOffset+=4
    const msg = buf.subarray(lenOffset, len + lenOffset);
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
      start:offset,
      end:len + lenOffset
    };
  } else {
    throw new Error("message is missing magic string:" + buf.toString());
  }
};

export const readMessages = (buff: Buffer): RawMessage[] => {
  let offset = 0
  let messages : RawMessage[] = []
  while(offset < buff.length) {
    const msg = readMessage(buff, offset)
    offset = msg.end
    messages.push(msg)
  }
  return messages
}