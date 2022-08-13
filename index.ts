import net from 'net'
import { EventEmitter } from 'events'
import { writeMessage, readMessage } from './message'
import { Types } from './constants'
import type { MsgType } from './types'

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
        this.emit("data", msg)
    }

    send = (type:MsgType, value?: string) => {
        const msg = writeMessage(type, value ?? '')
        this.socket.write(msg)
    }
}