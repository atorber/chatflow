# stronger-typed-streams

While I am a fan of [RxJS](https://github.com/Reactive-Extensions/RxJS) there are still advantages to using just plain [NodeJS Streams](https://nodejs.org/api/stream.html), the main one for me being that back-pressure just works.

The TypeScript bindings for NodeJS Streams are perfectly adequate themselves but I felt that the typings could also ensure that the [Readable](https://nodejs.org/api/stream.html#stream_class_stream_readable) is outputting to a compatible [Writable](https://nodejs.org/api/stream.html#stream_class_stream_writable) or [Transform](https://nodejs.org/api/stream.html#stream_class_stream_transform).

This mini project, which really is pretty much just subclasses of the NodeJS Streams classes aims to address that deficiency. This means that if you have a model of the following:

    `Farm` -> `Bakery` -> `Shop`

Where `Flour` is the input to the Bakery, which converts it into `Bread` for selling in the shop. Going from `Farm` to `Shop` directly is not allowed as customers of the shop wish to buy bread not flour.

In code the only valid way to join these should be:

    let farm = new Farm({highWaterMark: 1});
    let bakery = new Bakery({highWaterMark: 1});
    let shop = new Shop({highWaterMark: 1}, stock);
    
    let supplyChain = farm.pipe(bakery).pipe(shop);

But the core NodeJS TypeScript bindings would allow going directly from `farm` to `shop`.

## Installation

    npm install --save stronger-typed-streams

## Usage

Create a subclass of to plant and sow grain:

    class Farm extends Readable<Flour> {

        private i: number = 0;

        constructor(opts = {}) {
            super(Object.assign({objectMode: true}, opts));
        }

        _read() {
            let v = this.i++ < 8 ? new Flour(1) : null;
            process.nextTick(() => {
                this.push(v);
            });
        }
    }

And a class that converts Flour to Bread:

    class Bakery extends Transform<Flour, Bread> {

        private flour: Flour[] = [];

        constructor(opts = {}) {
            super(Object.assign({objectMode: true}, opts));
        }

        _flush(cb) {
            process.nextTick(() => {
                if (this.flour.length) {
                    this.push(new Bread(this.flour));
                }
                this.flour = [];
                cb();
            });
        }

        _transform(flour: Flour, encoding, cb) {
            process.nextTick(() => {
                this.flour.push(flour);
                if (this.flour.length >= 3) {
                    this._flush(cb);
                    return;
                }
                cb();
            });
        }

    }

And something to sell the finished product to the consumers:

    class Shop extends Writable<Bread> {

        constructor(opts = {}, out) {
            super(Object.assign({objectMode: true}, opts));
        }

        _write(bread: Bread, encoding, cb) {
            process.nextTick(() => {
                console.log("Bread for sale!);
                cb();
            });
        }
    }

Now create a supply chain by joining instances of all the classes together:

    let farm = new Farm({highWaterMark: 1});
    let bakery = new Bakery({highWaterMark: 1});
    let shop = new Shop({highWaterMark: 1}, stock);
    
    let supplyChain = farm.pipe(bakery).pipe(shop);

If you tried to attach a Farm directly to a Shop the TypeScript compiler would tell you:

    TS2345: Argument of type 'Shop' is not assignable to parameter of type 'Writable<Flour>'.

Which is absolutely correct and allows you to catch errors at compile time instead of runtime, perhaps in the wild.

There is also a Duplex implementation, but this is only tested in Node versions >= 8 because in the tests I an API method that is only available in Node 8+.
