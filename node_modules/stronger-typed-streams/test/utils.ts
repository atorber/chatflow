import { Duplex, Readable, Writable, Transform } from '../src/utils';
import test from 'ava';

class Flour {
    kg: number;

    constructor(kg) {
        this.kg = kg;
    }
}

enum Size { OnlyPackaging, Small, Medium, Large }

class Bread {

    size: Size;

    constructor(flours: Flour[]) {
        switch (flours.length) {
            case 0:
                this.size = Size.OnlyPackaging;
                break;
            case 1:
                this.size = Size.Small;
                break;
            case 2:
                this.size = Size.Medium;
                break;
            case 3:
                this.size = Size.Large;
                break;
        }
    }
}

class Farm extends Readable<Flour> {

    private i: number = 0;

    constructor(opts = {}) {
        super(Object.assign({objectMode: true}, opts));
    }

    _read(size) {
        let v = this.i++ < 8 ? new Flour(1) : null;
        process.nextTick(() => {
            this.push(v);
        });
    }
}

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

class Person extends Writable<Bread> {

    out: Bread[] = [];

    constructor(opts = {}, out) {
        super(Object.assign({objectMode: true}, opts));
        this.out = out;
    }

    _write(bread: Bread, encoding, cb) {
        process.nextTick(() => {
            this.out.push(bread);
            cb();
        });
    }
}

class Proxy<T> extends Duplex<T, T> {

    private store: T[] = [];
    private outstanding: number = 0;

    constructor(opts = {}) {
        super(Object.assign({objectMode: true}, opts));
    }

    _write(bread: T, encoding, cb) {
        process.nextTick(() => {
            this.store.push(bread);
            while (this.outstanding && this.store.length) {
                this.outstanding--;
                this.push(<T>this.store.shift());
            }
            cb();
        });
    }

    _final(cb) {
        this.push(null);
    }

    _read(size) {
        process.nextTick(() => {
            while (size--) {
                if (this.store.length) {
                    this.push(<T>this.store.shift());
                }
                else {
                    this.outstanding = size + 1;
                    return;
                }
            }
        });
    }
}

class Shop extends Proxy<Bread> {
}

function getNodeMajorVersion() {
    return parseInt(process.version.slice(1).replace(/\..*/, ''), 10);
}

test.cb('Can stream', function(tst) {

    let stock: Bread[] = [];
    let farm = new Farm({});
    let bakery = new Bakery({});
    let shop = new Shop({});
    let person = new Person({}, stock);

    let supplyChain;
    if (getNodeMajorVersion() < 8) { // I used _final in Shop/Proxy<T> which is
                                     // only available in Node 8+
        supplyChain = farm.pipe(bakery).pipe(person);
    } else {
        supplyChain = farm.pipe(bakery).pipe(shop).pipe(person);
    }

    // Uncomment below for type error!
    // let badSupplyChain: Writable<Bread> = farm.pipe(person);

    supplyChain.on('finish', () => {
        tst.is(stock.length, 3, `There should be three loves was (${stock.length})`);
        tst.is(stock[0].size, Size.Large, `The first item of bread should have been large (${stock[0].size})`);
        tst.is(stock[1].size, Size.Large, `The first item of bread should have been large (${stock[1].size})`);
        tst.is(stock[2].size, Size.Medium, `The first item of bread should have been medium (${stock[2].size})`);
        tst.end();
    });

});

