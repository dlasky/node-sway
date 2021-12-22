import os from 'os'

export const Types = {
  RUN_COMMAND: 0, //Runs the payload as sway commands
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

const magic = Buffer.from('i3-ipc')

const end = os.endianness()

export const message = (type, value) => {
    const msg = Buffer.from(value ?? '')
    const len = msg.length
    const buf = Buffer.alloc(8)
    buf['writeInt32'+end](len)
    buf['writeInt32'+end](type,4)
    readMessage(Buffer.concat([magic, buf]))
    return Buffer.concat([magic, buf, msg])
}

export const readMessage = (buf) => {
    const type = buf.readInt32LE(6)
    const len = buf.readInt32LE(10)
    console.log({type, len})
}