'use strict'

const AbstractLevelDOWN = require('abstract-leveldown').AbstractLevelDOWN
const AbstractChainedBatch = require('abstract-leveldown').AbstractChainedBatch
const AbstractIterator = require('abstract-leveldown').AbstractIterator
const inherits = require('inherits')
const Codec = require('level-codec')
const EncodingError = require('level-errors').EncodingError
const rangeMethods = ['approximateSize', 'compactRange']

module.exports = DB

function DB (db, opts) {
  if (!(this instanceof DB)) return new DB(db, opts)

  const manifest = db.supports || {}
  const additionalMethods = manifest.additionalMethods || {}

  AbstractLevelDOWN.call(this, manifest)

  this.supports.encodings = true
  this.supports.additionalMethods = {}

  rangeMethods.forEach(function (m) {
    // TODO (future major): remove this fallback
    const fallback = typeof db[m] === 'function'

    if (additionalMethods[m] || fallback) {
      this.supports.additionalMethods[m] = true

      this[m] = function (start, end, opts, cb) {
        start = this.codec.encodeKey(start, opts)
        end = this.codec.encodeKey(end, opts)
        return this.db[m](start, end, opts, cb)
      }
    }
  }, this)

  opts = opts || {}
  if (typeof opts.keyEncoding === 'undefined') opts.keyEncoding = 'utf8'
  if (typeof opts.valueEncoding === 'undefined') opts.valueEncoding = 'utf8'

  this.db = db
  this.codec = new Codec(opts)
}

inherits(DB, AbstractLevelDOWN)

DB.prototype.type = 'encoding-down'

DB.prototype._serializeKey =
DB.prototype._serializeValue = function (datum) {
  return datum
}

DB.prototype._open = function (opts, cb) {
  this.db.open(opts, cb)
}

DB.prototype._close = function (cb) {
  this.db.close(cb)
}

DB.prototype._put = function (key, value, opts, cb) {
  key = this.codec.encodeKey(key, opts)
  value = this.codec.encodeValue(value, opts)
  this.db.put(key, value, opts, cb)
}

DB.prototype._get = function (key, opts, cb) {
  key = this.codec.encodeKey(key, opts)
  opts.asBuffer = this.codec.valueAsBuffer(opts)

  this.db.get(key, opts, (err, value) => {
    if (err) return cb(err)

    try {
      value = this.codec.decodeValue(value, opts)
    } catch (err) {
      return cb(new EncodingError(err))
    }

    cb(null, value)
  })
}

DB.prototype._getMany = function (keys, opts, cb) {
  keys = keys.map((key) => this.codec.encodeKey(key, opts))
  opts.asBuffer = this.codec.valueAsBuffer(opts)

  this.db.getMany(keys, opts, (err, values) => {
    if (err) return cb(err)

    const decoded = new Array(values.length)

    for (let i = 0; i < values.length; i++) {
      if (values[i] === undefined) {
        decoded[i] = undefined
        continue
      }

      try {
        decoded[i] = this.codec.decodeValue(values[i], opts)
      } catch (err) {
        return cb(new EncodingError(err))
      }
    }

    cb(null, decoded)
  })
}

DB.prototype._del = function (key, opts, cb) {
  key = this.codec.encodeKey(key, opts)
  this.db.del(key, opts, cb)
}

DB.prototype._chainedBatch = function () {
  return new Batch(this)
}

DB.prototype._batch = function (ops, opts, cb) {
  ops = this.codec.encodeBatch(ops, opts)
  this.db.batch(ops, opts, cb)
}

DB.prototype._iterator = function (opts) {
  opts.keyAsBuffer = this.codec.keyAsBuffer(opts)
  opts.valueAsBuffer = this.codec.valueAsBuffer(opts)
  return new Iterator(this, opts)
}

DB.prototype._clear = function (opts, callback) {
  opts = this.codec.encodeLtgt(opts)
  this.db.clear(opts, callback)
}

function Iterator (db, opts) {
  AbstractIterator.call(this, db)
  this.codec = db.codec
  this.keys = opts.keys
  this.values = opts.values
  this.opts = this.codec.encodeLtgt(opts)
  this.it = db.db.iterator(this.opts)
}

inherits(Iterator, AbstractIterator)

Iterator.prototype._next = function (cb) {
  this.it.next((err, key, value) => {
    if (err) return cb(err)

    try {
      if (this.keys && typeof key !== 'undefined') {
        key = this.codec.decodeKey(key, this.opts)
      } else {
        key = undefined
      }

      if (this.values && typeof value !== 'undefined') {
        value = this.codec.decodeValue(value, this.opts)
      } else {
        value = undefined
      }
    } catch (err) {
      return cb(new EncodingError(err))
    }

    cb(null, key, value)
  })
}

Iterator.prototype._seek = function (key) {
  key = this.codec.encodeKey(key, this.opts)
  this.it.seek(key)
}

Iterator.prototype._end = function (cb) {
  this.it.end(cb)
}

function Batch (db, codec) {
  AbstractChainedBatch.call(this, db)
  this.codec = db.codec
  this.batch = db.db.batch()
}

inherits(Batch, AbstractChainedBatch)

Batch.prototype._put = function (key, value, options) {
  key = this.codec.encodeKey(key, options)
  value = this.codec.encodeValue(value, options)
  this.batch.put(key, value)
}

Batch.prototype._del = function (key, options) {
  key = this.codec.encodeKey(key, options)
  this.batch.del(key)
}

Batch.prototype._clear = function () {
  this.batch.clear()
}

Batch.prototype._write = function (opts, cb) {
  this.batch.write(opts, cb)
}
