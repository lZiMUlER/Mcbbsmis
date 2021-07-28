"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zlib_1 = require("zlib");
const util_1 = require("util");
const inflateAsync = util_1.promisify(zlib_1.inflate);
const blank = Buffer.alloc(16);
// https://github.com/lovelyyoshino/Bilibili-Live-API/blob/master/API.WebSocket.md
const cutBuffer = (buffer) => {
    const bufferPacks = [];
    let size;
    for (let i = 0; i < buffer.length; i += size) {
        size = buffer.readInt32BE(i);
        bufferPacks.push(buffer.slice(i, i + size));
    }
    return bufferPacks;
};
exports.decoder = async (buffer) => {
    const packs = await Promise.all(cutBuffer(buffer)
        .map(async (buf) => {
        const body = buf.slice(16);
        const protocol = buf.readInt16BE(6);
        const operation = buf.readInt32BE(8);
        let type = 'unknow';
        if (operation === 3) {
            type = 'heartbeat';
        }
        else if (operation === 5) {
            type = 'message';
        }
        else if (operation === 8) {
            type = 'welcome';
        }
        let data;
        if (protocol === 0) {
            data = JSON.parse(String(body));
        }
        if (protocol === 1 && body.length === 4) {
            data = body.readUIntBE(0, 4);
        }
        if (protocol === 2) {
            data = await exports.decoder((await inflateAsync(body)));
        }
        return { buf, type, protocol, data };
    }));
    return packs.flatMap(pack => {
        if (pack.protocol === 2) {
            return pack.data;
        }
        return pack;
    });
};
exports.encoder = (type, body = '') => {
    if (typeof body !== 'string') {
        body = JSON.stringify(body);
    }
    const head = Buffer.from(blank);
    const buffer = Buffer.from(body);
    head.writeInt32BE(buffer.length + head.length, 0);
    head.writeInt16BE(16, 4);
    head.writeInt16BE(1, 6);
    if (type === 'heartbeat') {
        head.writeInt32BE(2, 8);
    }
    if (type === 'join') {
        head.writeInt32BE(7, 8);
    }
    head.writeInt32BE(1, 12);
    return Buffer.concat([head, buffer]);
};
