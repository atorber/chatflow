import Datastore from 'nedb-promises'

const db:any = {}

db.message = Datastore.create({
  autoload: true,
  filename: './db/messages.db',
})

db.bot = Datastore.create({
  autoload: true,
  filename: './db/bot.db',
})

db.room = Datastore.create({
  autoload: true,
  filename: './db/room.db',
})

db.contact = Datastore.create({
  autoload: true,
  filename: './db/contact.db',
})

export {
  db,
}
