import net from 'net'
import { EventEmitter } from 'events'
import {Types, message, readMessage} from './message.mjs'

export default class SwayIPC extends EventEmitter {

    types = Types

    constructor() {
        super()
        const sway = process.env.SWAYSOCK
        this.socket = net.createConnection(sway)
        this.socket.on('data', this.handleData)
    }

    handleData = (data) => {
        const str = data.slice(14, data.length)
        try {
            this.emit("data", JSON.parse(str))
        } catch (e) {
            this.emit("error", e)
        }
    }

    send = (type, value) => {
        const msg = message(type, value)
        this.socket.write(msg)
    }
}