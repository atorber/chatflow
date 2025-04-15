/**
 * Matchers
 */
import {
  MessageMatcherOptions,
  messageMatcher,
}                         from './message-matcher.js'
import {
  RoomMatcherOptions,
  roomMatcher,
}                         from './room-matcher.js'
import {
  ContactMatcherOptions,
  contactMatcher,
}                         from './contact-matcher.js'
import {
  StringMatcherOptions,
  stringMatcher,
}                         from './string-matcher.js'
import {
  LanguageMatcherOptions,
  languageMatcher,
}                         from './language-matcher.js'

export type {
  ContactMatcherOptions,
  LanguageMatcherOptions,
  MessageMatcherOptions,
  RoomMatcherOptions,
  StringMatcherOptions,
}
export {
  contactMatcher,
  languageMatcher,
  messageMatcher,
  roomMatcher,
  stringMatcher,
}
