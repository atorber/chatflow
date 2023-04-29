import Datastore from 'nedb'
function DB (this: any, database: any) {
  const options = {
    autoload: true,
    filename: database,
  }
  this.db = new Datastore(options)
}

DB.prototype.limit = function (offset: number, limit: number) {
  this.offset = offset || 0
  this.limit = limit || 15
  return this
}
DB.prototype.sort = function (orderby: any) {
  this.orderby = orderby
  return this
}
DB.prototype.find = function (query: any, select: any) {
  return new Promise((resolve, reject) => {
    const stmt = this.db.find(query || {})
    if (this.orderby !== undefined) {
      stmt.sort(this.orderby)
    }
    if (this.offset !== undefined) {
      stmt.skip(this.offset).limit(this.limit)
    }
    if (select !== undefined) {
      stmt.projection(select || {})
    }
    stmt.exec((err: any, docs: unknown) => {
      if (err) {
        return reject(err)
      }
      resolve(docs)
    })
  })
}
DB.prototype.findOne = function (query: any, select: any) {
  return new Promise((resolve, reject) => {
    const stmt = this.db.findOne(query || {})
    if (this.sort !== undefined) {
      stmt.sort(this.sort)
    }
    if (select !== undefined) {
      stmt.projection(select || {})
    }
    stmt.exec((err: any, doc: unknown) => {
      if (err) {
        return reject(err)
      }
      resolve(doc)
    })
  })
}
DB.prototype.insert = function (values: any) {
  return new Promise((resolve, reject) => {
    this.db.insert(values, (err: any, newDoc: unknown) => {
      if (err) {
        return reject(err)
      }
      resolve(newDoc)
    })
  })
}
DB.prototype.update = function (query: any, values: any, options: any) {
  return new Promise((resolve, reject) => {
    this.db.update(query || {}, values || {}, options || {}, (err: any, numAffected: unknown) => {
      if (err) {
        return reject(err)
      }
      resolve(numAffected)
    })
  })
}
DB.prototype.remove = function (query: any, options: any) {
  return new Promise((resolve, reject) => {
    this.db.remove(query || {}, options || {}, (err: any, numAffected: unknown) => {
      if (err) {
        return reject(err)
      }
      resolve(numAffected)
    })
  })
}
export default (database: any) => {
  return DB(database)
}
