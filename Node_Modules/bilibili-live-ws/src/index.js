"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const net_1 = __importDefault(require("net"));
const isomorphic_ws_1 = __importDefault(require("isomorphic-ws"));
const buffer_1 = require("./buffer");
exports.relayEvent = Symbol('relay');
exports.isNode = !!isomorphic_ws_1.default.Server;
const WebSocket = exports.isNode ? isomorphic_ws_1.default : class extends events_1.EventEmitter {
    constructor(address, ...args) {
        super();
        const ws = new isomorphic_ws_1.default(address);
        this.ws = ws;
        ws.onopen = () => this.emit('open');
        ws.onmessage = async ({ data }) => this.emit('message', Buffer.from(await new Response(data).arrayBuffer()));
        ws.onerror = () => this.emit('error');
        ws.onclose = () => this.emit('close');
    }
    get readyState() {
        return this.ws.readyState;
    }
    send(data) {
        this.ws.send(data);
    }
    close(code, data) {
        this.ws.close(code, data);
    }
};
class NiceEventEmitter extends events_1.EventEmitter {
    emit(eventName, ...params) {
        super.emit(eventName, ...params);
        super.emit(exports.relayEvent, eventName, ...params);
        return true;
    }
}
class Live extends NiceEventEmitter {
    constructor(roomid, { send, close, protover, key }) {
        if (typeof roomid !== 'number' || Number.isNaN(roomid)) {
            throw new Error(`roomid ${roomid} must be Number not NaN`);
        }
        super();
        this.roomid = roomid;
        this.online = 0;
        this.live = false;
        this.closed = false;
        this.timeout = setTimeout(() => { }, 0);
        this.send = send;
        this.close = () => {
            this.closed = true;
            close();
        };
        this.on('message', async (buffer) => {
            const packs = await buffer_1.decoder(buffer);
            packs.forEach(pack => {
                const { type, data } = pack;
                if (type === 'welcome') {
                    this.live = true;
                    this.emit('live');
                    this.send(buffer_1.encoder('heartbeat'));
                }
                if (type === 'heartbeat') {
                    this.online = data;
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => this.heartbeat(), 1000 * 30);
                    this.emit('heartbeat', this.online);
                }
                if (type === 'message') {
                    this.emit('msg', data);
                    const cmd = data.cmd || (data.msg && data.msg.cmd);
                    if (cmd) {
                        if (cmd.includes('DANMU_MSG')) {
                            this.emit('DANMU_MSG', data);
                        }
                        else {
                            this.emit(cmd, data);
                        }
                    }
                }
            });
        });
        this.on('open', () => {
            const hi = { uid: 0, roomid, protover, platform: 'web', clientver: '2.0.11', type: 2 };
            if (key) {
                hi.key = key;
            }
            const buf = buffer_1.encoder('join', hi);
            this.send(buf);
        });
        this.on('close', () => {
            clearTimeout(this.timeout);
        });
        this.on('_error', error => {
            this.close();
            this.emit('error', error);
        });
    }
    heartbeat() {
        this.send(buffer_1.encoder('heartbeat'));
    }
    getOnline() {
        this.heartbeat();
        return new Promise(resolve => this.once('heartbeat', resolve));
    }
}
class LiveWS extends Live {
    constructor(roomid, { address = 'wss://broadcastlv.chat.bilibili.com/sub', protover = 2, key, agent } = {}) {
        const ws = new WebSocket(address, { agent });
        const send = (data) => {
            if (ws.readyState === 1) {
                ws.send(data);
            }
        };
        const close = () => this.ws.close();
        super(roomid, { send, close, protover, key });
        ws.on('open', (...params) => this.emit('open', ...params));
        ws.on('message', data => this.emit('message', data));
        ws.on('close', (code, reason) => this.emit('close', code, reason));
        ws.on('error', error => this.emit('_error', error));
        this.ws = ws;
    }
}
exports.LiveWS = LiveWS;
class LiveTCP extends Live {
    constructor(roomid, { host = 'broadcastlv.chat.bilibili.com', port = 2243, protover = 2, key } = {}) {
        const socket = net_1.default.connect(port, host);
        const send = (data) => {
            socket.write(data);
        };
        const close = () => this.socket.end();
        super(roomid, { send, close, protover, key });
        this.buffer = Buffer.alloc(0);
        socket.on('ready', () => this.emit('open'));
        socket.on('close', () => this.emit('close'));
        socket.on('error', (...params) => this.emit('_error', ...params));
        socket.on('data', buffer => {
            this.buffer = Buffer.concat([this.buffer, buffer]);
            this.splitBuffer();
        });
        this.socket = socket;
    }
    splitBuffer() {
        while (this.buffer.length >= 4 && this.buffer.readInt32BE(0) <= this.buffer.length) {
            const size = this.buffer.readInt32BE(0);
            const pack = this.buffer.slice(0, size);
            this.buffer = this.buffer.slice(size);
            this.emit('message', pack);
        }
    }
}
exports.LiveTCP = LiveTCP;
const keepLive = (Base) => class extends events_1.EventEmitter {
    constructor(...params) {
        super();
        this.params = params;
        this.closed = false;
        this.interval = 100;
        this.timeout = 45 * 1000;
        this.connection = new Base(...this.params);
        this.connect(false);
    }
    connect(reconnect = true) {
        if (reconnect) {
            this.connection = new Base(...this.params);
        }
        const connection = this.connection;
        let timeout = setTimeout(() => {
            connection.close();
            connection.emit('timeout');
        }, this.timeout);
        connection.on(exports.relayEvent, (eventName, ...params) => {
            if (eventName !== 'error') {
                this.emit(eventName, ...params);
            }
        });
        connection.on('error', (e) => this.emit('e', e));
        connection.on('close', () => {
            if (!this.closed) {
                setTimeout(() => this.connect(), this.interval);
            }
        });
        connection.on('heartbeat', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                connection.close();
                connection.emit('timeout');
            }, this.timeout);
        });
        connection.on('close', () => {
            clearTimeout(timeout);
        });
    }
    get online() {
        return this.connection.online;
    }
    get roomid() {
        return this.connection.roomid;
    }
    close() {
        this.closed = true;
        this.connection.close();
    }
    heartbeat() {
        return this.connection.heartbeat();
    }
    getOnline() {
        return this.connection.getOnline();
    }
    send(data) {
        return this.connection.send(data);
    }
};
class KeepLiveWS extends keepLive(LiveWS) {
}
exports.KeepLiveWS = KeepLiveWS;
class KeepLiveTCP extends keepLive(LiveTCP) {
}
exports.KeepLiveTCP = KeepLiveTCP;
