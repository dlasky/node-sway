import os from "os";

export type MsgType = number;
export type MsgTypes = Record<string, MsgType>;

export const Types: MsgTypes = {
  RUN_COMMAND: 0 as MsgType, //Runs the payload as sway commands
  GET_WORKSPACES: 1, //Get the list of current workspaces
  SUBSCRIBE: 2, //Subscribe the IPC connection to the events listed in the payload
  GET_OUTPUTS: 3, //Get the list of current outputs
  GET_TREE: 4, //Get the node layout tree
  GET_MARKS: 5, //Get the names of all the marks currently set
  GET_BAR_CONFIG: 6, //Get the specified bar config or a list of bar config names
  GET_VERSION: 7, //Get the version of sway that owns the IPC socket
  GET_BINDING_MODES: 8, //Get the list of binding mode names
  GET_CONFIG: 9, //Returns the config that was last loaded
  SEND_TICK: 10, //Sends a tick event with the specified payload
  SYNC: 11, //Replies failure object for i3 compatibility
  GET_BINDING_STATE: 12, //Request the current binding state, e.g. the currently active binding mode name.
  GET_INPUTS: 100, //Get the list of input devices
  GET_SEATS: 101, //Get the list of seats
};

const magic = Buffer.from("i3-ipc");

const end = os.endianness();

const writeInt32 = (buf: Buffer, value: number, offset?: number) => {
  if (end === "BE") {
    return buf.writeInt32BE(value, offset);
  }
  return buf.writeInt32LE(value, offset);
};

const readInt32 = (buf:Buffer, offset?:number) => {
  if (end === "BE") {
    return buf.readInt32BE(offset)
  }
  return buf.readInt32LE(offset)
}

//<magic><i32 len><i32 type><msg>

export const writeMessage = (type: MsgType, value: string) => {
  const msg = Buffer.from(value ?? "");
  const len = msg.length;
  const buf = Buffer.alloc(8);
  writeInt32(buf, len);
  writeInt32(buf, type, 4);
  return Buffer.concat([magic, buf, msg]);
};

type RawMessage = {
  type: MsgType
  value: string
}

export const readMessage = (buf: Buffer) : RawMessage => {
  if (magic.compare(buf, 0, magic.length)===0) {
      let lenOffset = magic.length
      const len = buf.readInt32LE(lenOffset)
      const typ = buf.readInt32LE(lenOffset+4)
      const msg = buf.subarray(lenOffset+8, len+6+8)

      return {
        type:typ,
        value:msg.toString()
      }
  } else {
    throw(new Error("message is missing magic string:"+ buf.toString()))
  }
};
