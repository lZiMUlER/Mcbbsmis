/// <reference types="node" />
export declare const decoder: (buffer: Buffer) => Promise<{
    buf: Buffer;
    type: string;
    protocol: number;
    data: any;
}[]>;
export declare const encoder: (type: string, body?: any) => Buffer;
