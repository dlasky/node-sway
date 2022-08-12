import net from 'net'
import { EventEmitter } from 'events'
import { message, Types } from './message'
import type {MsgType} from "./message"

export default class SwayIPC extends EventEmitter {

    static types = Types
    private socket : net.Socket

    constructor() {
        super()
        const sway = process.env.SWAYSOCK ?? ''
        this.socket = net.createConnection(sway)
        this.socket.on('data', this.handleData)
    }

    handleData = (data : Buffer) => {
        const str = data.slice(14, data.length).toString()
        try {
            this.emit("data", JSON.parse(str))
        } catch (e) {
            this.emit("error", e)
        }
    }

    send = (type:MsgType, value: string) => {
        const msg = message(type, value)
        this.socket.write(msg)
    }
}