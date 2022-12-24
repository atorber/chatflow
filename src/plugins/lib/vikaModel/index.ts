import type {
    Sheets
} from './Model'
import messageSheet from './Message.js'
import commandSheet from './CommandList.js'
import configSheet from './EnvConfig.js'
import switchSheet from './Switch.js'
import contactSheet from './Contact.js'
// import qaSheet from './QaList.js'
import roomListSheet from './Room.js'
import roomWhiteListSheet from './RoomWhiteList.js'
import contactWhiteListSheet from './ContactWhiteList.js'
import noticeSheet from './Notice.js'
// import groupSheet from './ContactGroup.js'

const sheets: Sheets = {
    configSheet,
    switchSheet,
    commandSheet,
    contactSheet,
    roomListSheet,
    // qaSheet,
    roomWhiteListSheet,
    contactWhiteListSheet,
    // groupSheet,
    noticeSheet,
    messageSheet,
}

export {
    sheets,
}

export default sheets
