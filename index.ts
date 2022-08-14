import net from 'net'
import { EventEmitter } from 'events'
import { writeMessage, readMessage } from './message'
import { EventType, MsgType } from './types'

export default class SwayIPC extends EventEmitter {

    static types = MsgType
    static events = EventType
    private socket : net.Socket

    constructor() {
        super()
        const sway = process.env.SWAYSOCK ?? ''
        this.socket = net.createConnection(sway)
        this.socket.on('data', this.handleData)
    }

    private handleData = (data : Buffer) => {
        this.emit("rawData", data.toString())
        const msg = readMessage(data)
        this.emit("data", msg)
    }

    send = (type:MsgType, value?: string) => {
        const msg = writeMessage(type, value ?? '')
        this.socket.write(msg)
    }

    subscribe = (events: EventType[]) => {
        const strEvents = events.map(evt => EventType[evt])
        this.send(MsgType.SUBSCRIBE, JSON.stringify(strEvents))
    }
}