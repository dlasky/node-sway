export type JSONLike = Record<string, any>

export type MsgType = number;
export type MsgTypes = Record<string, MsgType>;

export type RawMessage = {
    type: MsgType
    value: string
    data: JSONLike
};