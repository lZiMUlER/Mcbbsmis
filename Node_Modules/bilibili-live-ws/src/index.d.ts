/// <reference types="ws" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { Socket } from 'net';
import IsomorphicWebSocket from 'isomorphic-ws';
import { Agent } from 'http';
export declare const relayEvent: unique symbol;
export declare const isNode = true;
declare const WebSocket: typeof IsomorphicWebSocket | {
    new (address: string, ...args: any[]): {
        ws: IsomorphicWebSocket;
        readonly readyState: number;
        send(data: Buffer): void;
        close(code?: number | undefined, data?: string | undefined): void;
        addListener(event: string | symbol, listener: (...args: any[]) => void): any;
        on(event: string | symbol, listener: (...args: any[]) => void): any;
        once(event: string | symbol, listener: (...args: any[]) => void): any;
        removeListener(event: string | symbol, listener: (...args: any[]) => void): any;
        off(event: string | symbol, listener: (...args: any[]) => void): any;
        removeAllListeners(event?: string | symbol | undefined): any;
        setMaxListeners(n: number): any;
        getMaxListeners(): number;
        listeners(event: string | symbol): Function[];
        rawListeners(event: string | symbol): Function[];
        emit(event: string | symbol, ...args: any[]): boolean;
        listenerCount(type: string | symbol): number;
        prependListener(event: string | symbol, listener: (...args: any[]) => void): any;
        prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): any;
        eventNames(): (string | symbol)[];
    };
    listenerCount(emitter: EventEmitter, event: string | symbol): number;
    defaultMaxListeners: number;
};
declare class NiceEventEmitter extends EventEmitter {
    emit(eventName: string | symbol, ...params: any[]): boolean;
}
declare class Live extends NiceEventEmitter {
    roomid: number;
    online: number;
    live: boolean;
    closed: boolean;
    timeout: ReturnType<typeof setTimeout>;
    send: (data: Buffer) => void;
    close: () => void;
    constructor(roomid: number, { send, close, protover, key }: {
        send: (data: Buffer) => void;
        close: () => void;
        protover: 1 | 2;
        key?: string;
    });
    heartbeat(): void;
    getOnline(): Promise<number>;
}
export declare class LiveWS extends Live {
    ws: InstanceType<typeof WebSocket>;
    constructor(roomid: number, { address, protover, key, agent }?: {
        address?: string;
        protover?: 1 | 2;
        key?: string;
        agent?: Agent;
    });
}
export declare class LiveTCP extends Live {
    socket: Socket;
    buffer: Buffer;
    constructor(roomid: number, { host, port, protover, key }?: {
        host?: string;
        port?: number;
        protover?: 1 | 2;
        key?: string;
    });
    splitBuffer(): void;
}
declare const KeepLiveWS_base: {
    new (...params: [number, ({
        address?: string | undefined;
        protover?: 2 | 1 | undefined;
        key?: string | undefined;
        agent?: Agent | undefined;
    } | undefined)?] | [number, ({
        host?: string | undefined;
        port?: number | undefined;
        protover?: 2 | 1 | undefined;
        key?: string | undefined;
    } | undefined)?]): {
        params: [number, any?];
        closed: boolean;
        interval: number;
        timeout: number;
        connection: LiveWS | LiveTCP;
        connect(reconnect?: boolean): void;
        readonly online: number;
        readonly roomid: number;
        close(): void;
        heartbeat(): void;
        getOnline(): Promise<number>;
        send(data: Buffer): void;
        addListener(event: string | symbol, listener: (...args: any[]) => void): any;
        on(event: string | symbol, listener: (...args: any[]) => void): any;
        once(event: string | symbol, listener: (...args: any[]) => void): any;
        removeListener(event: string | symbol, listener: (...args: any[]) => void): any;
        off(event: string | symbol, listener: (...args: any[]) => void): any;
        removeAllListeners(event?: string | symbol | undefined): any;
        setMaxListeners(n: number): any;
        getMaxListeners(): number;
        listeners(event: string | symbol): Function[];
        rawListeners(event: string | symbol): Function[];
        emit(event: string | symbol, ...args: any[]): boolean;
        listenerCount(type: string | symbol): number;
        prependListener(event: string | symbol, listener: (...args: any[]) => void): any;
        prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): any;
        eventNames(): (string | symbol)[];
    };
    listenerCount(emitter: EventEmitter, event: string | symbol): number;
    defaultMaxListeners: number;
};
export declare class KeepLiveWS extends KeepLiveWS_base {
}
declare const KeepLiveTCP_base: {
    new (...params: [number, ({
        address?: string | undefined;
        protover?: 2 | 1 | undefined;
        key?: string | undefined;
        agent?: Agent | undefined;
    } | undefined)?] | [number, ({
        host?: string | undefined;
        port?: number | undefined;
        protover?: 2 | 1 | undefined;
        key?: string | undefined;
    } | undefined)?]): {
        params: [number, any?];
        closed: boolean;
        interval: number;
        timeout: number;
        connection: LiveWS | LiveTCP;
        connect(reconnect?: boolean): void;
        readonly online: number;
        readonly roomid: number;
        close(): void;
        heartbeat(): void;
        getOnline(): Promise<number>;
        send(data: Buffer): void;
        addListener(event: string | symbol, listener: (...args: any[]) => void): any;
        on(event: string | symbol, listener: (...args: any[]) => void): any;
        once(event: string | symbol, listener: (...args: any[]) => void): any;
        removeListener(event: string | symbol, listener: (...args: any[]) => void): any;
        off(event: string | symbol, listener: (...args: any[]) => void): any;
        removeAllListeners(event?: string | symbol | undefined): any;
        setMaxListeners(n: number): any;
        getMaxListeners(): number;
        listeners(event: string | symbol): Function[];
        rawListeners(event: string | symbol): Function[];
        emit(event: string | symbol, ...args: any[]): boolean;
        listenerCount(type: string | symbol): number;
        prependListener(event: string | symbol, listener: (...args: any[]) => void): any;
        prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): any;
        eventNames(): (string | symbol)[];
    };
    listenerCount(emitter: EventEmitter, event: string | symbol): number;
    defaultMaxListeners: number;
};
export declare class KeepLiveTCP extends KeepLiveTCP_base {
}
export {};
