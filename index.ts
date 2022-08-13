import net from 'net'
import { EventEmitter } from 'events'
import { writeMessage, readMessage, Types } from './message'
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
        this.emit("rawData", data.toString())
        const msg = readMessage(data)
        try {
            const parsed = JSON.parse(msg.value)
            this.emit("data", parsed)
        } catch (e) {
            this.emit("error", e)
        }
    }

    send = (type:MsgType, value: string) => {
        const msg = writeMessage(type, value)
        this.socket.write(msg)
    }
}