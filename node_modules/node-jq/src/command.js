import * as Joi from '@hapi/joi'
import path from 'path'
import {
  parseOptions,
  optionsSchema,
  preSpawnSchema,
  spawnSchema
} from './options'

const JQ_PATH = process.env.JQ_PATH || path.join(__dirname, '..', 'bin', 'jq')

export const FILTER_UNDEFINED_ERROR =
  'node-jq: invalid filter argument supplied: "undefined"'
export const INPUT_JSON_UNDEFINED_ERROR =
  'node-jq: invalid json object argument supplied: "undefined"'
export const INPUT_STRING_ERROR =
  'node-jq: invalid json string argument supplied'

const NODE_JQ_ERROR_TEMPLATE =
  'node-jq: invalid {#label} ' +
  'argument supplied{if(#label == "path" && #type == "json", " (not a .json file)", "")}' +
  '{if(#label == "path" && #type == "path", " (not a valid path)", "")}: ' +
  '"{if(#value != undefined, #value, "undefined")}"'

const messages = {
  'any.invalid': NODE_JQ_ERROR_TEMPLATE,
  'any.required': NODE_JQ_ERROR_TEMPLATE,
  'string.base': NODE_JQ_ERROR_TEMPLATE,
  'string.empty': NODE_JQ_ERROR_TEMPLATE
}

const validateArguments = (filter, json, options) => {
  const context = { filter, json }
  const validatedOptions = Joi.attempt(options, optionsSchema)
  const validatedPreSpawn = Joi.attempt(
    context,
    preSpawnSchema.tailor(validatedOptions.input),
    { messages }
  )
  const validatedArgs = parseOptions(
    validatedOptions,
    validatedPreSpawn.filter,
    validatedPreSpawn.json
  )
  const validatedSpawn = Joi.attempt(
    {},
    spawnSchema.tailor(validatedOptions.input),
    { context: { ...validatedPreSpawn, options: validatedOptions } }
  )

  if (validatedOptions.input === 'file') {
    return {
      args: validatedArgs,
      stdin: validatedSpawn.stdin
    }
  }
  return {
    args: validatedArgs,
    stdin: validatedSpawn.stdin
  }
}

export const commandFactory = (filter, json, options = {}, jqPath) => {
  const command = jqPath ? path.join(jqPath, './jq') : JQ_PATH
  const result = validateArguments(filter, json, options)

  return {
    command,
    args: result.args,
    stdin: result.stdin
  }
}
