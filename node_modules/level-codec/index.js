'use strict'

const encodings = require('./lib/encodings')
const rangeOptions = new Set(['lt', 'gt', 'lte', 'gte'])

module.exports = Codec

function Codec (opts) {
  if (!(this instanceof Codec)) {
    return new Codec(opts)
  }
  this.opts = opts || {}
  this.encodings = encodings
}

Codec.prototype._encoding = function (encoding) {
  if (typeof encoding === 'string') encoding = encodings[encoding]
  if (!encoding) encoding = encodings.id
  return encoding
}

Codec.prototype._keyEncoding = function (opts, batchOpts) {
  return this._encoding((batchOpts && batchOpts.keyEncoding) ||
                        (opts && opts.keyEncoding) ||
                        this.opts.keyEncoding)
}

Codec.prototype._valueEncoding = function (opts, batchOpts) {
  return this._encoding((batchOpts && (batchOpts.valueEncoding || batchOpts.encoding)) ||
                        (opts && (opts.valueEncoding || opts.encoding)) ||
                        (this.opts.valueEncoding || this.opts.encoding))
}

Codec.prototype.encodeKey = function (key, opts, batchOpts) {
  return this._keyEncoding(opts, batchOpts).encode(key)
}

Codec.prototype.encodeValue = function (value, opts, batchOpts) {
  return this._valueEncoding(opts, batchOpts).encode(value)
}

Codec.prototype.decodeKey = function (key, opts) {
  return this._keyEncoding(opts).decode(key)
}

Codec.prototype.decodeValue = function (value, opts) {
  return this._valueEncoding(opts).decode(value)
}

Codec.prototype.encodeBatch = function (ops, opts) {
  return ops.map((_op) => {
    const op = {
      type: _op.type,
      key: this.encodeKey(_op.key, opts, _op)
    }
    if (this.keyAsBuffer(opts, _op)) op.keyEncoding = 'binary'
    if (_op.prefix) op.prefix = _op.prefix
    if ('value' in _op) {
      op.value = this.encodeValue(_op.value, opts, _op)
      if (this.valueAsBuffer(opts, _op)) op.valueEncoding = 'binary'
    }
    return op
  })
}

Codec.prototype.encodeLtgt = function (ltgt) {
  const ret = {}

  for (const key of Object.keys(ltgt)) {
    if (key === 'start' || key === 'end') {
      throw new Error('Legacy range options ("start" and "end") have been removed')
    }

    ret[key] = rangeOptions.has(key)
      ? this.encodeKey(ltgt[key], ltgt)
      : ltgt[key]
  }

  return ret
}

Codec.prototype.createStreamDecoder = function (opts) {
  if (opts.keys && opts.values) {
    return (key, value) => {
      return {
        key: this.decodeKey(key, opts),
        value: this.decodeValue(value, opts)
      }
    }
  } else if (opts.keys) {
    return (key) => {
      return this.decodeKey(key, opts)
    }
  } else if (opts.values) {
    return (_, value) => {
      return this.decodeValue(value, opts)
    }
  } else {
    return function () {}
  }
}

Codec.prototype.keyAsBuffer = function (opts) {
  return this._keyEncoding(opts).buffer
}

Codec.prototype.valueAsBuffer = function (opts) {
  return this._valueEncoding(opts).buffer
}
