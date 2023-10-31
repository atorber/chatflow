import Datastore from 'nedb'

class DB {

  private db: any
  private offsetValue: number
  private limitValue: number
  private orderby: any

  constructor (database: any) {
    const options = {
      autoload: true,
      filename: database,
    }
    this.db = new Datastore(options)
    this.offsetValue = 0
    this.limitValue = 15
  }

  public limit (offset?: number, limit?: number): this {
    this.offsetValue = offset || 0
    this.limitValue = limit || 15
    return this
  }

  public sort (orderby: any): this {
    this.orderby = orderby
    return this
  }

  public find (query: any, select?: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.find(query || {})
      if (this.orderby !== undefined) {
        stmt.sort(this.orderby)
      }
      if (this.offsetValue !== 0) {
        stmt.skip(this.offsetValue).limit(this.limitValue)
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

  public findOne (query: any, select?: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.findOne(query || {})
      if (this.orderby !== undefined) {
        stmt.sort(this.orderby)
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

  public insert (values: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.db.insert(values, (err: any, newDoc: unknown) => {
        if (err) {
          return reject(err)
        }
        resolve(newDoc)
      })
    })
  }

  // options: {
  //   multi: true,
  //   upsert: true,
  //   returnUpdatedDocs: true,
  //   returnOriginal: false,
  //   returnUpdatedExisting: false
  // }
  public update (query: any, values: any, options?: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.db.update(query || {}, values || {}, options || {}, (err: any, numAffected: unknown) => {
        if (err) {
          return reject(err)
        }
        resolve(numAffected)
      })
    })
  }

  public remove (query: any, options?: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.db.remove(query || {}, options || {}, (err: any, numAffected: unknown) => {
        if (err) {
          return reject(err)
        }
        resolve(numAffected)
      })
    })
  }

}

export default (database: any) => {
  return new DB(database)
}
