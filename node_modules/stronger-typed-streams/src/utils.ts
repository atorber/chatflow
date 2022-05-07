import * as NodeStream from 'stream';

export abstract class Readable<Out> extends NodeStream.Readable {

    constructor(opts = {}) {
        super(opts);
    }

    abstract _read(size: number);

    push(chunk: Out|null, encoding?: BufferEncoding): boolean {
        return super.push(chunk, encoding);
    }

    pipe<NextDuplexOut>(destination: Duplex<Out, NextDuplexOut>, options?: { end?: boolean; }):  Duplex<Out, NextDuplexOut>;
    pipe<NextTransformOut>(destination: Transform<Out, NextTransformOut>, options?: { end?: boolean; }):  Transform<Out, NextTransformOut>;
    pipe(destination: Writable<Out>, options?: { end?: boolean; }): Writable<Out>;
    pipe<T>(destination: NodeJS.WritableStream, options?: { end?: boolean; }): NodeJS.WritableStream {
        return super.pipe(destination, options);
    }
}

export abstract class Duplex<In, Out> extends NodeStream.Duplex {

    constructor(opts = {}) {
        super(opts);
    }

    push(chunk: Out|null, encoding?: BufferEncoding): boolean {
        return super.push(chunk, encoding);
    }

    pipe<NextDuplexOut>(destination: Duplex<Out, NextDuplexOut>, options?: { end?: boolean; }):  Duplex<Out, NextDuplexOut>;
    pipe<NextTransformOut>(destination: Transform<Out, NextTransformOut>, options?: { end?: boolean; }):  Transform<Out, NextTransformOut>;
    pipe(destination: Writable<Out>, options?: { end?: boolean; }): Writable<Out>;
    pipe<T>(destination: NodeJS.WritableStream, options?: { end?: boolean; }): NodeJS.WritableStream {
        return super.pipe(destination, options);
    }
}

export class Transform<In, Out> extends NodeStream.Transform {

    constructor(opts = {}) {
        super(opts);
    }

    push(chunk: Out|null, encoding?: BufferEncoding): boolean {
        return super.push(chunk, encoding);
    }

    pipe<NextDuplexOut>(destination: Duplex<Out, NextDuplexOut>, options?: { end?: boolean; }):  Duplex<Out, NextDuplexOut>;
    pipe<NextTransformOut>(destination: Transform<Out, NextTransformOut>, options?: { end?: boolean; }):  Transform<Out, NextTransformOut>;
    pipe(destination: Writable<Out>, options?: { end?: boolean; }): Writable<Out>;
    pipe<T>(destination: NodeJS.WritableStream, options?: { end?: boolean; }): NodeJS.WritableStream {
        return super.pipe(destination, options);
    }
}

export abstract class Writable<In> extends NodeStream.Writable {

    constructor(opts = {}) {
        super(opts);
    }

    abstract _write(chunk: In, encoding: BufferEncoding, callback: Function): void;
}
