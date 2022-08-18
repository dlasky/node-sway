export type JSONLike = Record<string, any>;

export enum MsgType {
    RUN_COMMAND = 0, //Runs the payload as sway commands
    GET_WORKSPACES = 1, //Get the list of current workspaces
    SUBSCRIBE = 2, //Subscribe the IPC connection to the events listed in the payload
    GET_OUTPUTS = 3, //Get the list of current outputs
    GET_TREE = 4, //Get the node layout tree
    GET_MARKS = 5, //Get the names of all the marks currently set
    GET_BAR_CONFIG = 6, //Get the specified bar config or a list of bar config names
    GET_VERSION = 7, //Get the version of sway that owns the IPC socket
    GET_BINDING_MODES = 8, //Get the list of binding mode names
    GET_CONFIG = 9, //Returns the config that was last loaded
    SEND_TICK = 10, //Sends a tick event with the specified payload
    SYNC = 11, //Replies failure object for i3 compatibility
    GET_BINDING_STATE = 12, //Request the current binding state, e.g. the currently active binding mode name.
    GET_INPUTS = 100, //Get the list of input devices
    GET_SEATS = 101, //Get the list of seats
}


export enum EventType {
    WORKSPACE= 0x80000000, //Sent whenever an event involving a workspace occurs such as initialization of a new workspace or a different workspace gains focus
    MODE= 0x80000002, //mode	Sent whenever the binding mode changes
    WINDOW= 0x80000003, //Sent whenever an event involving a view occurs such as being reparented, focused, or closed
    BARCONFIG_UPDATE= 0x80000004, //		Sent whenever a bar config changes
    BINDING= 0x80000005, //	binding	Sent when a configured binding is executed
    SHUTDOWN= 0x80000006, //Sent when the ipc shuts down because sway is exiting
    TICK = 0x80000007, //Sent when an ipc client sends a SEND_TICK message
    BAR_STATE_UPDATE = 0x80000014, //Send when the visibility of a bar should change due to a modifier
    INPUT = 0x80000015, //Sent when something related to input devices changes
  };

export type RawMessage = {
  type: MsgType;
  value: string;
  data: JSONLike;
  start: number;
  end: number;
};
