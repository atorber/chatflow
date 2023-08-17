import Datastore from 'nedb-promises'

const db:any = {}

db.message = Datastore.create({
  autoload: true,
  filename: 'data/db/messages.db',
})

db.bot = Datastore.create({
  autoload: true,
  filename: 'data/db/bot.db',
})

db.room = Datastore.create({
  autoload: true,
  filename: 'data/db/room.db',
})

db.contact = Datastore.create({
  autoload: true,
  filename: 'data/db/contact.db',
})

export {
  db,
}
